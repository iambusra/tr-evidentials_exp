local_library <- Sys.getenv("TR_EVIDENTIALS_R_LIBRARY", unset = "")
if (nzchar(local_library)) {
  .libPaths(c(local_library, .libPaths()))
}

suppressPackageStartupMessages({
  library(jsonlite)
  library(dplyr)
  library(ggplot2)
  library(ordinal)
  library(emmeans)
  library(lme4)
  library(scales)
})

data_dir <- Sys.getenv("TR_EVIDENTIALS_DATA_DIR", unset = "")
if (!nzchar(data_dir)) {
  stop("Set TR_EVIDENTIALS_DATA_DIR to the private directory containing response JSON files.")
}

out_dir <- Sys.getenv("TR_EVIDENTIALS_OUTPUT_DIR", unset = file.path("analysis", "results", "cleaned-analysis"))
public_data_dir <- Sys.getenv("TR_EVIDENTIALS_PUBLIC_DATA_DIR", unset = "")
dir.create(out_dir, recursive = TRUE, showWarnings = FALSE)

FILLER_ERROR_LIMIT <- 5L
MIN_PARTICIPANT_MEDIAN_RT_MS <- 3000
MAX_PARTICIPANT_MEDIAN_RT_MS <- 60000
MIN_TRIAL_RT_MS <- 1000
MAX_TRIAL_RT_MS <- 180000

`%||%` <- function(x, y) {
  if (is.null(x) || length(x) == 0) return(y)
  if (length(x) == 1 && is.na(x)) return(y)
  x
}

read_session <- function(path) {
  d <- fromJSON(path, simplifyVector = FALSE)
  pid <- as.character(d$participant$participantId %||% tools::file_path_sans_ext(basename(path)))
  sid <- as.character(d$session$sessionId %||% NA_character_)
  completed <- as.character(d$session$completedAt %||% NA_character_)
  native <- tolower(trimws(as.character(d$demographics$nativeTurkish %||% "")))

  responses <- d$responses %||% list()
  attention <- Filter(function(x) identical(x$itemType, "attention"), responses)
  attention_pass <- length(attention) >= 2 &&
    all(vapply(attention, function(x) isTRUE(x$attentionPassed), logical(1)))

  participant <- data.frame(
    participant = pid,
    session = sid,
    completed_at = completed,
    native_turkish = native,
    attention_pass = attention_pass,
    stringsAsFactors = FALSE
  )

  response_df <- bind_rows(lapply(responses, function(x) {
    data.frame(
      participant = pid,
      session = sid,
      trial_id = as.character(x$trialId %||% NA_character_),
      item = as.character(x$itemId %||% NA_character_),
      item_type = as.character(x$itemType %||% NA_character_),
      sequence = as.integer(x$sequence %||% NA_integer_),
      rating = as.integer(x$rating %||% NA_integer_),
      response_time_ms = as.numeric(x$responseTimeMs %||% NA_real_),
      marker = as.character(x$marker %||% NA_character_),
      source = as.character(x$evidenceSource %||% NA_character_),
      strength = as.character(x$evidenceStrength %||% NA_character_),
      timing = as.character(x$acquisitionTiming %||% NA_character_),
      filler_intended = as.character(x$fillerIntended %||% NA_character_),
      stringsAsFactors = FALSE
    )
  }))

  timing_checks <- d$realtimeResponses %||% list()
  timing_df <- bind_rows(lapply(timing_checks, function(x) {
    data.frame(
      participant = pid,
      session = sid,
      trial_id = as.character(x$trialId %||% NA_character_),
      perceived_timing = as.character(x$answer %||% NA_character_),
      matches_intended = isTRUE(x$matchesIntendedTiming),
      stringsAsFactors = FALSE
    )
  }))

  list(participant = participant, responses = response_df, timing = timing_df)
}

files <- list.files(data_dir, pattern = "\\.json$", full.names = TRUE, recursive = TRUE)
sessions <- lapply(files, read_session)
participants <- bind_rows(lapply(sessions, `[[`, "participant")) %>%
  arrange(participant, desc(completed_at)) %>%
  group_by(participant) %>%
  dplyr::slice(1) %>%
  ungroup()
responses <- bind_rows(lapply(sessions, `[[`, "responses"))
timing_checks <- bind_rows(lapply(sessions, `[[`, "timing"))

fillers <- responses %>%
  filter(item_type == "filler") %>%
  mutate(
    clear_filler_error =
      (filler_intended == "good" & rating %in% 1:3) |
      (filler_intended == "bad" & rating %in% 5:7)
  )

filler_qc <- fillers %>%
  group_by(participant, session) %>%
  summarise(
    filler_trials = n(),
    filler_errors = sum(clear_filler_error, na.rm = TRUE),
    .groups = "drop"
  )

rt_qc <- responses %>%
  filter(item_type %in% c("critical", "filler"), is.finite(response_time_ms)) %>%
  group_by(participant, session) %>%
  summarise(median_main_rt_ms = median(response_time_ms), .groups = "drop")

participant_qc <- participants %>%
  left_join(filler_qc, by = c("participant", "session")) %>%
  left_join(rt_qc, by = c("participant", "session")) %>%
  mutate(
    native_pass = native_turkish == "yes",
    filler_pass = filler_trials == 16 & filler_errors < FILLER_ERROR_LIMIT,
    speed_pass = median_main_rt_ms >= MIN_PARTICIPANT_MEDIAN_RT_MS &
      median_main_rt_ms <= MAX_PARTICIPANT_MEDIAN_RT_MS,
    included_participant = native_pass & attention_pass & filler_pass & speed_pass,
    exclusion_reason = case_when(
      !native_pass ~ "not_native_turkish",
      !attention_pass ~ "attention_check_failure",
      is.na(filler_trials) | filler_trials != 16 ~ "missing_filler_trials",
      filler_errors >= FILLER_ERROR_LIMIT ~ "filler_error_threshold",
      is.na(median_main_rt_ms) ~ "missing_response_times",
      median_main_rt_ms < MIN_PARTICIPANT_MEDIAN_RT_MS ~ "median_rt_too_short",
      median_main_rt_ms > MAX_PARTICIPANT_MEDIAN_RT_MS ~ "median_rt_too_long",
      TRUE ~ "included"
    )
  )

included_ids <- participant_qc %>% filter(included_participant) %>% pull(participant)

critical_all <- responses %>%
  filter(item_type == "critical") %>%
  left_join(
    timing_checks %>% select(participant, session, trial_id, perceived_timing, matches_intended),
    by = c("participant", "session", "trial_id")
  )

analysis_data <- critical_all %>%
  filter(
    participant %in% included_ids,
    matches_intended,
    response_time_ms >= MIN_TRIAL_RT_MS,
    response_time_ms <= MAX_TRIAL_RT_MS,
    rating %in% 1:7
  ) %>%
  mutate(
    rating_ord = ordered(rating, levels = 1:7),
    marker = factor(marker, levels = c("di", "mis")),
    timing = factor(timing, levels = c("realtime", "after")),
    strength = factor(strength, levels = c("strong", "weak")),
    source = factor(source, levels = c("own", "reportative")),
    participant = factor(participant),
    item = factor(item)
  )

timing_congruent_count <- critical_all %>%
  filter(
    participant %in% included_ids,
    matches_intended,
    rating %in% 1:7
  ) %>%
  nrow()

exclusion_flow <- data.frame(
  stage = c(
    "Completed response files",
    "Native Turkish speakers",
    "Native speakers passing both attention checks",
    "Also passing filler criterion",
    "Final included participants after response-time criterion",
    "Critical trials before timing and trial-RT filters",
    "Timing-congruent critical trials before trial-RT filter",
    "Final timing-congruent critical trials"
  ),
  n = c(
    length(files),
    sum(participant_qc$native_pass, na.rm = TRUE),
    sum(participant_qc$native_pass & participant_qc$attention_pass, na.rm = TRUE),
    sum(participant_qc$native_pass & participant_qc$attention_pass & participant_qc$filler_pass, na.rm = TRUE),
    length(included_ids),
    sum(critical_all$participant %in% included_ids),
    timing_congruent_count,
    nrow(analysis_data)
  )
)
write.csv(exclusion_flow, file.path(out_dir, "exclusion-flow.csv"), row.names = FALSE)

exclusion_reasons <- participant_qc %>% count(exclusion_reason, name = "participants") %>% arrange(desc(participants))
write.csv(exclusion_reasons, file.path(out_dir, "participant-exclusion-reasons.csv"), row.names = FALSE)

control <- clmm.control(maxIter = 250, gradTol = 1e-5, maxLineIter = 250)

fit_ordinal_suite <- function(dat) {
  full <- clmm(
    rating_ord ~ marker * timing * strength * source + (1 | participant) + (1 | item),
    data = dat, link = "logit", Hess = TRUE, nAGQ = 1, control = control
  )
  no_timing <- clmm(
    rating_ord ~ marker * strength * source + timing * strength * source + (1 | participant) + (1 | item),
    data = dat, link = "logit", Hess = TRUE, nAGQ = 1, control = control
  )
  no_source <- clmm(
    rating_ord ~ marker * timing * strength + source * timing * strength + (1 | participant) + (1 | item),
    data = dat, link = "logit", Hess = TRUE, nAGQ = 1, control = control
  )
  no_strength <- clmm(
    rating_ord ~ marker * timing * source + strength * timing * source + (1 | participant) + (1 | item),
    data = dat, link = "logit", Hess = TRUE, nAGQ = 1, control = control
  )
  list(full = full, no_timing = no_timing, no_source = no_source, no_strength = no_strength)
}

ordinal_fits <- fit_ordinal_suite(analysis_data)

fit_random_slope_ordinal <- function(dat) {
  first_attempt <- try(
    clmm(
      rating_ord ~ marker * timing * strength * source +
        (1 + timing | participant) + (1 + marker | item),
      data = dat, link = "logit", Hess = TRUE, nAGQ = 1, control = control
    ),
    silent = TRUE
  )
  if (!inherits(first_attempt, "try-error")) {
    return(list(model = first_attempt, label = "Ordinal mixed model with participant timing and item marker slopes"))
  }
  fallback <- clmm(
    rating_ord ~ marker * timing * strength * source +
      (1 + timing | participant) + (1 | item),
    data = dat, link = "logit", Hess = TRUE, nAGQ = 1, control = control
  )
  list(model = fallback, label = "Ordinal mixed model with participant timing slope")
}

random_slope_ordinal <- fit_random_slope_ordinal(analysis_data)

lmm_full <- lmer(
  rating ~ marker * timing * strength * source +
    (1 + timing | participant) + (1 + marker | item),
  data = analysis_data,
  REML = FALSE,
  control = lmerControl(optimizer = "bobyqa", optCtrl = list(maxfun = 200000))
)

extract_lrt <- function(reduced, full, family_label) {
  full_ll <- logLik(full)
  reduced_ll <- logLik(reduced)
  lr <- 2 * (as.numeric(full_ll) - as.numeric(reduced_ll))
  df <- attr(full_ll, "df") - attr(reduced_ll, "df")
  data.frame(family = family_label, lr_chisq = lr, df = df, p_value = pchisq(lr, df = df, lower.tail = FALSE))
}

lrt_results <- bind_rows(
  extract_lrt(ordinal_fits$no_timing, ordinal_fits$full, "Marker x timing"),
  extract_lrt(ordinal_fits$no_strength, ordinal_fits$full, "Marker x strength"),
  extract_lrt(ordinal_fits$no_source, ordinal_fits$full, "Marker x source")
)
write.csv(lrt_results, file.path(out_dir, "omnibus-model-comparisons.csv"), row.names = FALSE)

extract_predictions <- function(fit) {
  z <- as.data.frame(confint(emmeans(fit, ~ marker * timing | strength, mode = "mean.class"), type = "response"))
  z %>% transmute(marker, timing, strength, estimate = mean.class, lower = asymp.LCL, upper = asymp.UCL)
}

model_predictions <- extract_predictions(ordinal_fits$full)
write.csv(model_predictions, file.path(out_dir, "model-estimated-ratings.csv"), row.names = FALSE)

extract_predictions_by_source <- function(fit) {
  z <- as.data.frame(confint(
    emmeans(fit, ~ marker * timing * source | strength, mode = "mean.class"),
    type = "response"
  ))
  z %>% transmute(
    marker,
    timing,
    strength,
    source,
    estimate = mean.class,
    lower = asymp.LCL,
    upper = asymp.UCL
  )
}

model_predictions_by_source <- extract_predictions_by_source(ordinal_fits$full)
write.csv(
  model_predictions_by_source,
  file.path(out_dir, "model-estimated-ratings-by-source.csv"),
  row.names = FALSE
)

marker_cell_emmeans <- emmeans(
  ordinal_fits$full,
  ~ marker | timing * strength * source,
  mode = "mean.class"
)
condition_marker_contrasts <- as.data.frame(summary(
  contrast(marker_cell_emmeans, method = "pairwise", adjust = "none"),
  infer = c(TRUE, TRUE)
)) %>%
  transmute(
    timing,
    strength,
    source,
    contrast,
    estimate,
    SE,
    lower = asymp.LCL,
    upper = asymp.UCL,
    z_ratio = z.ratio,
    p_value = p.value
  )
write.csv(
  condition_marker_contrasts,
  file.path(out_dir, "condition-specific-marker-contrasts.csv"),
  row.names = FALSE
)

extract_did <- function(fit, ordinal = TRUE) {
  emm <- if (ordinal) {
    emmeans(fit, ~ marker * timing | strength, mode = "mean.class")
  } else {
    emmeans(fit, ~ marker * timing | strength)
  }
  z <- as.data.frame(summary(
    contrast(emm, interaction = c("pairwise", "pairwise"), by = "strength", adjust = "none"),
    infer = c(TRUE, TRUE)
  ))
  lower_name <- grep("^(asymp\\.LCL|lower\\.CL)$", names(z), value = TRUE)[1]
  upper_name <- grep("^(asymp\\.UCL|upper\\.CL)$", names(z), value = TRUE)[1]
  if (is.na(lower_name) || is.na(upper_name)) {
    stop("Could not identify confidence-interval columns in emmeans output.")
  }
  z$lower <- z[[lower_name]]
  z$upper <- z[[upper_name]]
  z
}

did_random_intercept <- extract_did(ordinal_fits$full, ordinal = TRUE)
did_random_slope <- extract_did(random_slope_ordinal$model, ordinal = TRUE)
did_lmm <- extract_did(lmm_full, ordinal = FALSE)

items <- levels(analysis_data$item)
loo_results <- bind_rows(lapply(items, function(held_out_item) {
  dat <- droplevels(analysis_data %>% filter(item != held_out_item))
  fit <- lmer(
    rating ~ marker * timing * strength * source + (1 | participant) + (1 | item),
    data = dat,
    REML = FALSE,
    control = lmerControl(optimizer = "bobyqa", optCtrl = list(maxfun = 100000))
  )
  strong <- extract_did(fit, ordinal = FALSE) %>% filter(strength == "strong")
  data.frame(
    held_out_item = held_out_item,
    estimate = strong$estimate,
    lower = strong$lower,
    upper = strong$upper,
    p_value = strong$p.value
  )
}))
write.csv(loo_results, file.path(out_dir, "leave-one-item-out-strong-interaction.csv"), row.names = FALSE)

strong_did <- function(x, label) {
  z <- x %>% filter(strength == "strong")
  data.frame(model = label, estimate = z$estimate, lower = z$lower, upper = z$upper, p_value = z$p.value)
}

robustness_results <- bind_rows(
  strong_did(did_random_intercept, "Ordinal random intercepts"),
  strong_did(did_random_slope, "Ordinal random slopes"),
  strong_did(did_lmm, "Continuous-rating mixed model"),
  data.frame(
    model = "Leave-one-item-out range",
    estimate = median(loo_results$estimate),
    lower = min(loo_results$estimate),
    upper = max(loo_results$estimate),
    p_value = NA_real_
  )
)
write.csv(robustness_results, file.path(out_dir, "robustness-model-summary.csv"), row.names = FALSE)
write.csv(bind_rows(
  did_random_intercept %>% mutate(model = "ordinal_random_intercepts"),
  did_random_slope %>% mutate(model = "ordinal_random_slopes"),
  did_lmm %>% mutate(model = "continuous_lmm")
), file.path(out_dir, "marker-by-timing-difference-in-differences.csv"), row.names = FALSE)

sanity <- analysis_data %>%
  filter(
    (marker == "di" & timing == "realtime" & strength == "strong" & source == "own") |
      (marker == "mis" & timing == "after" & strength == "strong" & source == "reportative")
  ) %>%
  mutate(sanity_cell = ifelse(
    marker == "di",
    "-DI: real-time + strong + personal",
    "-mIş: after-event + strong + hearsay"
  )) %>%
  group_by(participant, sanity_cell) %>%
  summarise(rating = mean(rating), .groups = "drop")

sanity_summary <- sanity %>%
  group_by(sanity_cell) %>%
  summarise(
    participants = n(),
    mean_rating = mean(rating),
    median_rating = median(rating),
    percent_six_or_seven = mean(rating >= 6),
    .groups = "drop"
  )
write.csv(sanity_summary, file.path(out_dir, "sanity-cell-summary.csv"), row.names = FALSE)

if (nzchar(public_data_dir)) {
  dir.create(public_data_dir, recursive = TRUE, showWarnings = FALSE)
  set.seed(20261104)
  randomized_ids <- sample(levels(analysis_data$participant))
  id_map <- data.frame(
    participant = randomized_ids,
    subject_id = sprintf("S%03d", seq_along(randomized_ids)),
    stringsAsFactors = FALSE
  )
  public_trials <- analysis_data %>%
    mutate(participant = as.character(participant)) %>%
    left_join(id_map, by = "participant") %>%
    transmute(
      subject_id,
      item_id = as.character(item),
      marker = as.character(marker),
      acquisition_timing = as.character(timing),
      evidence_strength = as.character(strength),
      evidence_source = as.character(source),
      rating,
      response_time_ms = as.integer(response_time_ms)
    ) %>%
    arrange(subject_id, item_id)
  write.csv(public_trials, file.path(public_data_dir, "deidentified-analysis-data.csv"), row.names = FALSE)
  write.csv(exclusion_flow, file.path(public_data_dir, "exclusion-flow.csv"), row.names = FALSE)
  codebook <- data.frame(
    variable = names(public_trials),
    description = c(
      "Random study-specific subject label with no retained public mapping to collection identifiers",
      "Critical stimulus item identifier",
      "Target evidential marker: di or mis",
      "Information acquisition timing: realtime or after",
      "Evidence strength: strong or weak",
      "Evidence source: own or reportative",
      "Acceptability rating from 1 to 7",
      "Response time for the acceptability judgment in milliseconds"
    )
  )
  write.csv(codebook, file.path(public_data_dir, "data-dictionary.csv"), row.names = FALSE)
}

cardinal <- "#8C1515"
cool_grey <- "#53565A"
black <- "#2E2D29"
fog <- "#DAD7CB"
stone <- "#B6B1A9"
gold <- "#B26A00"

poster_theme <- function(base_size = 17) {
  theme_minimal(base_size = base_size, base_family = "sans") +
    theme(
      text = element_text(colour = black),
      plot.title = element_text(face = "bold", size = rel(1.30), margin = margin(b = 7)),
      plot.subtitle = element_text(colour = cool_grey, size = rel(0.91), margin = margin(b = 15)),
      plot.caption = element_text(colour = cool_grey, size = rel(0.70), hjust = 0, margin = margin(t = 12)),
      axis.title = element_text(face = "bold", size = rel(0.91)),
      axis.text = element_text(colour = black, size = rel(0.87)),
      panel.grid.minor = element_blank(),
      panel.grid.major.x = element_blank(),
      panel.grid.major.y = element_line(colour = fog, linewidth = 0.45),
      strip.text = element_text(face = "bold", colour = black, size = rel(1.0), margin = margin(b = 7)),
      legend.position = "top",
      legend.justification = "left",
      legend.title = element_blank(),
      legend.text = element_text(face = "bold", size = rel(0.87)),
      plot.margin = margin(18, 26, 15, 18)
    )
}

quartz_pdf <- function(filename, width, height, ...) {
  grDevices::quartz(file = filename, type = "pdf", width = width, height = height, pointsize = 12, family = "Arial")
}

save_plot <- function(plot, stem, width, height) {
  ggsave(file.path(out_dir, paste0(stem, ".pdf")), plot, width = width, height = height, device = quartz_pdf)
  ggsave(file.path(out_dir, paste0(stem, ".png")), plot, width = width, height = height, dpi = 320, bg = "white")
}

prediction_plot <- model_predictions %>%
  mutate(
    marker_label = factor(marker, levels = c("di", "mis"), labels = c("-DI", "-mIş")),
    timing_num = ifelse(timing == "realtime", 1, 2),
    x_plot = timing_num + ifelse(marker == "di", -0.025, 0.025),
    x_label = x_plot + ifelse(marker == "di", -0.035, 0.035),
    label_hjust = ifelse(marker == "di", 1, 0),
    strength_label = factor(strength, levels = c("strong", "weak"), labels = c("Strong evidence", "Weak evidence")),
    label_y = estimate + ifelse(marker == "di", 0.25, -0.29)
  )

p1 <- ggplot(prediction_plot, aes(x = x_plot, y = estimate, colour = marker_label, group = marker_label, linetype = marker_label)) +
  geom_line(linewidth = 1.5) +
  geom_errorbar(aes(ymin = lower, ymax = upper), width = 0.045, linewidth = 0.8, linetype = "solid") +
  geom_point(aes(shape = marker_label, fill = marker_label), size = 4.6, stroke = 0.75, colour = "white") +
  geom_text(
    aes(x = x_label, y = label_y, hjust = label_hjust, label = sprintf("%.2f", estimate)),
    show.legend = FALSE,
    fontface = "bold",
    size = 4.5
  ) +
  facet_wrap(~ strength_label, nrow = 1) +
  scale_colour_manual(values = c("-DI" = cool_grey, "-mIş" = cardinal)) +
  scale_fill_manual(values = c("-DI" = cool_grey, "-mIş" = cardinal)) +
  scale_shape_manual(values = c("-DI" = 21, "-mIş" = 24)) +
  scale_linetype_manual(values = c("-DI" = "solid", "-mIş" = "22")) +
  scale_x_continuous(breaks = c(1, 2), labels = c("Real-time", "After the\nevent"), limits = c(0.75, 2.25), expand = c(0, 0)) +
  scale_y_continuous(breaks = 1:7, limits = c(1, 7), expand = expansion(mult = c(0.01, 0.02))) +
  guides(fill = "none", shape = "none") +
  labs(
    title = "Timing differentiates the markers under strong evidence",
    subtitle = "Analysis excludes timing-incongruent trials and participants failing prespecified quality criteria",
    x = NULL,
    y = "Expected rating (1 to 7)",
    caption = "Cumulative-link mixed model with participant and item random intercepts. Error bars show 95% confidence intervals."
  ) +
  poster_theme()
save_plot(p1, "figure-1-cleaned-timing-by-strength", 11.2, 6.3)

sanity_plot <- sanity %>%
  mutate(sanity_cell = factor(
    sanity_cell,
    levels = c("-DI: real-time + strong + personal", "-mIş: after-event + strong + hearsay"),
    labels = c("-DI\nReal-time, strong, personal", "-mIş\nAfter-event, strong, hearsay")
  ))
sanity_labels <- sanity_summary %>%
  mutate(
    sanity_cell = factor(
      sanity_cell,
      levels = c("-DI: real-time + strong + personal", "-mIş: after-event + strong + hearsay"),
      labels = c("-DI\nReal-time, strong, personal", "-mIş\nAfter-event, strong, hearsay")
    ),
    label = sprintf("Mean %.2f\n%.0f%% at 6 or above", mean_rating, 100 * percent_six_or_seven)
  )

set.seed(2401)
p2 <- ggplot(sanity_plot, aes(x = sanity_cell, y = rating, fill = sanity_cell, colour = sanity_cell)) +
  geom_violin(trim = TRUE, width = 0.82, alpha = 0.15, colour = NA) +
  geom_jitter(width = 0.11, height = 0.025, alpha = 0.24, size = 1.6, show.legend = FALSE) +
  geom_boxplot(width = 0.19, outlier.shape = NA, alpha = 0.88, colour = "white", linewidth = 0.7) +
  stat_summary(fun = mean, geom = "point", shape = 23, size = 4.2, fill = "white", colour = black, stroke = 0.8) +
  geom_text(data = sanity_labels, aes(x = sanity_cell, y = 1.25, label = label), inherit.aes = FALSE, colour = black, fontface = "bold", size = 4.6, lineheight = 1.05) +
  scale_fill_manual(values = c(cool_grey, cardinal)) +
  scale_colour_manual(values = c(cool_grey, cardinal)) +
  scale_y_continuous(breaks = 1:7, limits = c(0.85, 7.15), expand = expansion(mult = c(0.01, 0.02))) +
  guides(fill = "none", colour = "none") +
  labs(
    title = "Sanity cells are close to ceiling",
    subtitle = "Each point is one included participant's mean across matching trials",
    x = NULL,
    y = "Mean acceptability rating",
    caption = "Sanity cells are reported descriptively and are not used as participant-exclusion criteria."
  ) +
  poster_theme() +
  theme(axis.text.x = element_text(face = "bold"))
save_plot(p2, "figure-2-sanity-cell-ratings", 9.4, 6.5)

lrt_plot <- lrt_results %>%
  mutate(
    family = factor(family, levels = c("Marker x source", "Marker x strength", "Marker x timing")),
    p_label = ifelse(p_value < 0.001, "p < .001", sprintf("p = %.3f", p_value))
  )
lrt_limit <- ceiling(max(lrt_plot$lr_chisq) / 5) * 5 + 8

p3 <- ggplot(lrt_plot, aes(x = lr_chisq, y = family)) +
  geom_vline(xintercept = qchisq(0.95, df = 4), colour = stone, linetype = "22", linewidth = 0.8) +
  geom_segment(aes(x = 0, xend = lr_chisq, yend = family), colour = fog, linewidth = 2.3) +
  geom_point(aes(colour = family, shape = family), size = 5, stroke = 0.85) +
  geom_text(aes(label = p_label), hjust = -0.18, fontface = "bold", size = 4.7, colour = black) +
  scale_colour_manual(values = c("Marker x source" = cool_grey, "Marker x strength" = gold, "Marker x timing" = cardinal)) +
  scale_shape_manual(values = c("Marker x source" = 16, "Marker x strength" = 15, "Marker x timing" = 17)) +
  scale_x_continuous(breaks = seq(0, lrt_limit, by = 5), limits = c(0, lrt_limit), expand = c(0, 0)) +
  guides(colour = "none", shape = "none") +
  labs(
    title = "Timing is the clearest marker-specific predictor",
    subtitle = "Omnibus likelihood-ratio tests using the fully cleaned analysis dataset",
    x = "Likelihood-ratio chi-square (4 df)",
    y = NULL,
    caption = "Dashed line marks p = .05 for 4 df."
  ) +
  poster_theme() +
  theme(panel.grid.major.y = element_blank())
save_plot(p3, "figure-3-model-results-summary", 9.6, 6.0)

robustness_plot <- robustness_results %>%
  mutate(model = factor(
    model,
    levels = rev(c(
      "Ordinal random intercepts",
      "Ordinal random slopes",
      "Continuous-rating mixed model",
      "Leave-one-item-out range"
    ))
  ))
robustness_min <- floor((min(robustness_plot$lower, 0) - 0.08) * 10) / 10
robustness_max <- ceiling((max(robustness_plot$upper, 0) + 0.08) * 10) / 10

p4 <- ggplot(robustness_plot, aes(x = estimate, y = model)) +
  geom_vline(xintercept = 0, colour = black, linewidth = 0.75) +
  geom_errorbarh(aes(xmin = lower, xmax = upper), height = 0.14, linewidth = 1.0, colour = cool_grey) +
  geom_point(shape = 18, size = 5.2, colour = cardinal) +
  geom_text(aes(label = sprintf("%.2f", estimate)), nudge_y = 0.24, fontface = "bold", size = 4.5, colour = black) +
  scale_x_continuous(
    breaks = seq(robustness_min, robustness_max, 0.1),
    limits = c(robustness_min, robustness_max)
  ) +
  labs(
    title = "The strong-evidence timing interaction is robust",
    subtitle = "Positive values indicate a larger -DI advantage in real-time\nthan after-event contexts",
    x = "Marker-by-timing difference-in-differences (rating points)",
    y = NULL,
    caption = "Error bars are 95% confidence intervals. The leave-one-item-out row shows\nthe full estimate range across omitted items."
  ) +
  poster_theme() +
  theme(panel.grid.major.y = element_blank(), legend.position = "none")
save_plot(p4, "figure-4-robustness-models", 10.5, 6.0)

source_prediction_plot <- model_predictions_by_source %>%
  filter(strength == "strong") %>%
  mutate(
    marker_label = factor(marker, levels = c("di", "mis"), labels = c("-DI", "-mIş")),
    timing_num = ifelse(timing == "realtime", 1, 2),
    x_plot = timing_num + ifelse(marker == "di", -0.025, 0.025),
    x_label = x_plot + ifelse(marker == "di", -0.035, 0.035),
    label_hjust = ifelse(marker == "di", 1, 0),
    label_y = estimate + ifelse(marker == "di", 0.25, -0.29),
    source_label = factor(
      source,
      levels = c("own", "reportative"),
      labels = c("Personal perception", "Hearsay")
    )
  )

p5 <- ggplot(
  source_prediction_plot,
  aes(x = x_plot, y = estimate, colour = marker_label, group = marker_label, linetype = marker_label)
) +
  geom_line(linewidth = 1.5) +
  geom_errorbar(aes(ymin = lower, ymax = upper), width = 0.045, linewidth = 0.8, linetype = "solid") +
  geom_point(aes(shape = marker_label, fill = marker_label), size = 4.6, stroke = 0.75, colour = "white") +
  geom_text(
    aes(x = x_label, y = label_y, hjust = label_hjust, label = sprintf("%.2f", estimate)),
    show.legend = FALSE,
    fontface = "bold",
    size = 4.5
  ) +
  facet_wrap(~ source_label, nrow = 1) +
  scale_colour_manual(values = c("-DI" = cool_grey, "-mIş" = cardinal)) +
  scale_fill_manual(values = c("-DI" = cool_grey, "-mIş" = cardinal)) +
  scale_shape_manual(values = c("-DI" = 21, "-mIş" = 24)) +
  scale_linetype_manual(values = c("-DI" = "solid", "-mIş" = "22")) +
  scale_x_continuous(
    breaks = c(1, 2),
    labels = c("Real-time", "After the\nevent"),
    limits = c(0.75, 2.25),
    expand = c(0, 0)
  ) +
  scale_y_continuous(breaks = 1:7, limits = c(1, 7), expand = expansion(mult = c(0.01, 0.02))) +
  guides(fill = "none", shape = "none") +
  labs(
    title = "The strong-evidence timing pattern is similar across sources",
    subtitle = "Personal perception and hearsay shown separately; marker-by-source omnibus test: p = .594",
    x = NULL,
    y = "Expected rating (1 to 7)",
    caption = "Cumulative-link mixed model using the fully cleaned dataset. Error bars show 95% confidence intervals."
  ) +
  poster_theme()
save_plot(p5, "figure-5-strong-timing-by-source", 11.2, 6.3)

marker_contrast_plot <- condition_marker_contrasts %>%
  mutate(
    strength_label = factor(strength, levels = c("strong", "weak"), labels = c("Strong evidence", "Weak evidence")),
    source_label = ifelse(source == "own", "Personal", "Hearsay"),
    timing_label = ifelse(timing == "realtime", "Real-time", "After-event"),
    condition = factor(
      paste(source_label, timing_label, sep = ", "),
      levels = rev(c("Personal, Real-time", "Personal, After-event", "Hearsay, Real-time", "Hearsay, After-event"))
    ),
    favored_marker = ifelse(estimate >= 0, "-DI", "-mIş")
  )
contrast_limit <- ceiling((max(abs(c(marker_contrast_plot$lower, marker_contrast_plot$upper))) + 0.12) * 10) / 10

p6 <- ggplot(marker_contrast_plot, aes(x = estimate, y = condition)) +
  geom_vline(xintercept = 0, colour = stone, linetype = "22", linewidth = 0.9) +
  geom_errorbarh(
    aes(xmin = lower, xmax = upper, colour = favored_marker),
    height = 0.13,
    linewidth = 1.0
  ) +
  geom_point(aes(colour = favored_marker, shape = timing_label), size = 4.8, stroke = 0.85) +
  facet_wrap(~ strength_label, nrow = 1) +
  scale_colour_manual(values = c("-DI" = cool_grey, "-mIş" = cardinal)) +
  scale_shape_manual(values = c("Real-time" = 16, "After-event" = 17)) +
  scale_x_continuous(
    breaks = seq(-contrast_limit, contrast_limit, 0.2),
    limits = c(-contrast_limit, contrast_limit)
  ) +
  guides(colour = "none", shape = "none") +
  labs(
    title = "Timing reverses marker preference under strong evidence",
    subtitle = "Negative estimates favor -mIş; positive estimates favor -DI",
    x = "Estimated -DI minus -mIş rating (95% confidence interval)",
    y = NULL,
    caption = "Condition-specific contrasts from the cumulative-link mixed model using the fully cleaned dataset."
  ) +
  poster_theme() +
  theme(panel.grid.major.y = element_blank())
save_plot(p6, "figure-6-condition-specific-marker-contrast", 11.2, 6.6)

report <- c(
  "FULLY CLEANED ANALYSIS",
  "",
  "Exclusion thresholds:",
  sprintf("- Clear filler errors: exclude at %d or more of 16", FILLER_ERROR_LIMIT),
  sprintf("- Participant median main-trial RT: retain %d to %d ms", MIN_PARTICIPANT_MEDIAN_RT_MS, MAX_PARTICIPANT_MEDIAN_RT_MS),
  sprintf("- Individual critical-trial RT: retain %d to %d ms", MIN_TRIAL_RT_MS, MAX_TRIAL_RT_MS),
  "- Critical trials must match the intended timing interpretation",
  "",
  "Exclusion flow:",
  capture.output(print(exclusion_flow)),
  "",
  "Participant exclusion reasons:",
  capture.output(print(exclusion_reasons)),
  "",
  "Omnibus ordinal model comparisons:",
  capture.output(print(lrt_results)),
  "",
  "Difference-in-differences across models:",
  capture.output(print(robustness_results)),
  "",
  "Condition-specific marker contrasts:",
  capture.output(print(condition_marker_contrasts)),
  "",
  "Sanity cells:",
  capture.output(print(sanity_summary)),
  "",
  "Random-slope ordinal specification:",
  random_slope_ordinal$label,
  "",
  "Convergence codes:",
  sprintf("Random-intercept ordinal: %s", ordinal_fits$full$optRes$convergence),
  sprintf("Random-slope ordinal: %s", random_slope_ordinal$model$optRes$convergence),
  sprintf("Continuous LMM singular: %s", isSingular(lmm_full, tol = 1e-4))
)
writeLines(report, file.path(out_dir, "cleaned-analysis-report.txt"))
cat(paste(report, collapse = "\n"), "\n")
