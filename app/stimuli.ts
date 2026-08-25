export const CONDITION_KEYS = [
  "own_strong_realtime",
  "own_strong_after",
  "own_weak_realtime",
  "own_weak_after",
  "reportative_strong_realtime",
  "reportative_strong_after",
  "reportative_weak_realtime",
  "reportative_weak_after"
] as const;

export type ConditionKey = (typeof CONDITION_KEYS)[number];
export type Marker = "di" | "mis";

export const CRITICAL_ITEMS = [
  {
    "id": "crit-01",
    "target": {
      "di": "Nisan bahçeden çiçek topladı.",
      "mis": "Nisan bahçeden çiçek toplamış."
    },
    "contexts": {
      "own_strong_realtime": "Dün bahçede Nisan'la birlikteydin. Nisan çeşitli çiçeklerin yanına gidip saplarından tek tek kopardı ve elinde küçük bir demet yaptı.",
      "own_strong_after": "Bu sabah Nisan'ın odasında bahçedeki çiçeklerden oluşan taze bir demet gördün. Demetin saplarında yeni koparılmış izleri vardı; bahçeye çıktığında da aynı tür çiçeklerin bulunduğu yerde birkaç sapın yeni kopmuş olduğunu fark ettin. Evde çiçek toplamayı seven tek kişi Nisan.",
      "own_weak_realtime": "Dün bahçede Nisan'a benzeyen birinin çiçeklerin arasında eğilip kalktığını ve elinde bir şeyler biriktirdiğini gördün. Oldukça uzaktaydın; gerçekten Nisan mıydı ve çiçek mi topluyordu tam seçemedin.",
      "own_weak_after": "Bu sabah Nisan'ın odasında bahçedekilere benzeyen taze çiçeklerden oluşan bir demet gördün. Bahçede de birkaç çiçeğin koparılmış olduğunu fark ettin. Ancak Nisan'ın çiçekleri bahçeden kendisinin mi topladığı, yoksa birinden mi aldığı konusunda emin değilsin.",
      "reportative_strong_realtime": "Bahçenin duvarı çok yüksek olduğu için içeride olanları göremiyorsun. Yanındaki uzun boylu arkadaşın ise duvarın üzerinden bahçeyi görebiliyor ve Nisan'ın ne yaptığını sana an be an anlatıyor. Nisan çiçekleri tek tek koparıp elinde bir demet yaptıkça arkadaşın olanları sana aktarıyor.",
      "reportative_strong_after": "Nisan'la aynı evde yaşayan bir arkadaşın daha sonra sana Nisan'ın bahçeden çiçek topladığını anlattı.",
      "reportative_weak_realtime": "Bahçenin duvarı çok yüksek olduğu için içeride olanları göremiyorsun. Yanındaki uzun boylu arkadaşın ise duvarın üzerinden bahçeyi görebiliyor ve sana Nisan'ın çiçek topladığını an be an anlatıyor. Ancak arkadaşının birbirine çok benzeyen Nisan'la Elif'i sık sık karıştırdığını bildiğin için çiçek toplayanın gerçekten Nisan olduğundan emin değilsin.",
      "reportative_weak_after": "Bir arkadaşın sana Nisan'ın bahçeden çiçek topladığını söyledi. Ancak Nisan'la Elif'i sık sık birbirine karıştırdığını bildiğin için söylediğinden tam emin olamadın."
    }
  },
  {
    "id": "crit-02",
    "target": {
      "di": "Sinan bisiklete bindi.",
      "mis": "Sinan bisiklete binmiş."
    },
    "contexts": {
      "own_strong_realtime": "Dün parkta Sinan'la birlikteydin. Sinan bisikletinin üzerine oturdu, pedallara basmaya başladı ve parkın içinde bir süre bisiklet sürdü.",
      "own_strong_after": "Bugün Sinan'ın bisikletini gördün. Sele Sinan'ın boyuna göre ayarlanmıştı, pedallarda onun ayakkabılarından kalan taze çamur izleri vardı ve Sinan'ın kaskı bisikletin gidonuna asılmıştı. Bisikleti o gün başka kimse kullanmamıştı.",
      "own_weak_realtime": "Dün parkta Sinan'a çok benzeyen birinin bisiklete binip uzaklaştığını gördün. Kişiyi arkadan gördüğün ve aranızda mesafe olduğu için gerçekten Sinan olup olmadığından emin olamadın.",
      "own_weak_after": "Bugün Sinan'ın bisikletinin lastiklerinde taze çamur, gidonunda da Sinan'ın kaskını gördün. Ancak bisikleti kardeşi de zaman zaman kullandığı için dün bisiklete Sinan'ın mı bindiğinden emin değilsin.",
      "reportative_strong_realtime": "Sen evin içinde çalışırken kardeşin balkonda oturup sokakta olanları sana an be an anlatıyor. Sinan bisikletine bindiği anda bunu sana söylüyor; Sinan mahallede bisikletle dolaştıkça da ne yaptığını aktarmaya devam ediyor.",
      "reportative_strong_after": "Kardeşin daha sonra sana Sinan'ın o gün bisiklete binip mahallede dolaştığını anlattı.",
      "reportative_weak_realtime": "Sen evin içinde çalışırken kardeşin balkonda oturup sokakta olanları sana an be an anlatıyor. Sinan bisiklete bindiği anda bunu sana söylüyor ve mahallede dolaştığını aktarıyor. Ancak kardeşinin birbirine çok benzeyen Sinan'la Kenan'ı sık sık karıştırdığını bildiğin için bisiklete binenin gerçekten Sinan olduğundan emin değilsin.",
      "reportative_weak_after": "Kardeşin sana Sinan'ın bisiklete bindiğini söyledi. Ancak Sinan'la Kenan'ı sık sık karıştırdığını bildiğin için söylediğine tam olarak güvenemedin."
    }
  },
  {
    "id": "crit-03",
    "target": {
      "di": "Sinan bisikletten düştü.",
      "mis": "Sinan bisikletten düşmüş."
    },
    "contexts": {
      "own_strong_realtime": "Dün Sinan'la birlikte bisiklete biniyordunuz. Sinan bir virajı dönerken dengesini kaybetti, bisikletten yere düştü ve dizini tuttu. Olanları hemen yanında gördün.",
      "own_strong_after": "Bugün Sinan'ın bisikletinin gidonunda ve pedalında yeni çizikler, Sinan'ın dizinde de taze bir sıyrık gördün. Pantolonunun diz kısmı da yırtılmıştı ve üzerinde yol kenarındaki toprakla aynı renkte lekeler vardı.",
      "own_weak_realtime": "Dün Sinan'la birlikte bisiklete biniyordunuz. Bir virajı döndüğünde kısa süreliğine görüş alanından çıktı. Birkaç saniye sonra yerde otururken gördün; bisikleti de yanında yatıyordu. Düştüğünü düşündün ama kendi isteğiyle durmuş veya bisikletten inmiş de olabilir.",
      "own_weak_after": "Bugün Sinan'ın bisikletinin gidonunda yeni çizikler ve dizinde taze bir sıyrık gördün. Ancak Sinan'ın son günlerde başka sporlar da yaptığını biliyorsun; yarasının ve bisikletteki çiziklerin aynı olaydan kaynaklanıp kaynaklanmadığından emin değilsin.",
      "reportative_strong_realtime": "Sen evin içinde çalışırken kardeşin balkonda oturup sokakta olanları sana an be an anlatıyor. Sinan'ın bisiklete bindiğini söylüyor; biraz sonra Sinan dengesini kaybedip bisikletten düştüğü anda bunu da hemen sana aktarıyor.",
      "reportative_strong_after": "Kardeşin daha sonra sana Sinan'ın bisikletten düştüğünü anlattı.",
      "reportative_weak_realtime": "Sen evin içinde çalışırken kardeşin balkonda oturup sokakta olanları sana an be an anlatıyor. Bir ara Sinan'ın bisikletten düştüğünü hemen sana söylüyor. Ancak kardeşinin birbirine çok benzeyen Sinan'la Kenan'ı sık sık karıştırdığını bildiğin için düşenin gerçekten Sinan olduğundan emin değilsin.",
      "reportative_weak_after": "Kardeşin sana Sinan'ın bisikletten düştüğünü söyledi. Ancak Sinan'la Kenan'ı sık sık karıştırdığını bildiğin için söylediğinden tam emin olamadın."
    }
  },
  {
    "id": "crit-04",
    "target": {
      "di": "Sabah beni Ayşenur aradı.",
      "mis": "Sabah beni Ayşenur aramış."
    },
    "contexts": {
      "own_strong_realtime": "Bu sabah telefonun çaldı. Ekranda Ayşenur'un adı ve fotoğrafı görünüyordu. Telefonu açtın ve onunla birkaç dakika konuştun.",
      "own_strong_after": "Öğleden sonra telefonundaki arama geçmişine baktın. Sabah saatlerinde Ayşenur'un kayıtlı numarasından gelen ve birkaç dakika sürmüş bir arama görünüyordu.",
      "own_weak_realtime": "Bu sabah telefonun çaldı. Ekranda Ayşenur'un adına çok benzeyen bir isim gördün ama gözlüğün yanında olmadığı için tam okuyamadın. Telefonu açamadan arama sona erdi. Arayanın Ayşenur olduğunu düşündün ama emin değilsin.",
      "own_weak_after": "Öğleden sonra telefonunda sabah yapılmış cevapsız bir arama gördün. Numaranın ilk ve son rakamları Ayşenur'un numarasına benziyordu ama numara rehberinde kayıtlı değildi. Ayşenur'un yakın zamanda numarasını değiştirmiş olabileceğini düşündün, fakat arayanın gerçekten o olup olmadığından emin değilsin.",
      "reportative_strong_realtime": "Yoğun bir ofiste çalışıyorsun ve gelen telefonları önce sekreterin cevaplıyor. Sabah çalışırken sekreterin sana Ayşenur'un hatta olduğunu söylüyor. Çok meşgul olduğun için görüşemeyeceğini söyleyip telefonu bağlamamasını istiyorsun.",
      "reportative_strong_after": "Öğleden sonra sekreterin sana sabah Ayşenur'un aradığını söyledi.",
      "reportative_weak_realtime": "Yoğun bir ofiste çalışıyorsun ve gelen telefonları önce sekreterin cevaplıyor. Sabah sekreterin sana Ayşenur'un hatta olduğunu söylüyor. Ancak sekreterinin Ayşenur'la sesi çok benzeyen Lale'yi bazen karıştırdığını ve gelen aramaların numarasına da pek dikkat etmediğini bildiğin için arayanın gerçekten Ayşenur olduğundan emin değilsin.",
      "reportative_weak_after": "Öğleden sonra sekreterin sana sabah Ayşenur'un aradığını söyledi. Ancak Ayşenur'la Lale'nin seslerini bazen karıştırdığını bildiğin için arayanın gerçekten Ayşenur olduğundan emin olamadın."
    }
  },
  {
    "id": "crit-05",
    "target": {
      "di": "Mor ve Köşesi konser verdi.",
      "mis": "Mor ve Köşesi konser vermiş."
    },
    "contexts": {
      "own_strong_realtime": "Dün akşam Mor ve Köşesi'nin sahne aldığı mekândaydın. Grup sahneye çıktı, enstrümanlarını çaldı ve yaklaşık bir saat boyunca seyircilerin önünde şarkılarını seslendirdi. Sen de konseri başından sonuna kadar izledin.",
      "own_strong_after": "Bu sabah konser mekânına uğradın. Sahnede Mor ve Köşesi'nin üzerinde grup adı bulunan davul seti, gitarları ve birkaç şarkılık el yazısı set listesi duruyordu. Zeminde grubun logosunu taşıyan pena ve sahne ekipmanları da vardı.",
      "own_weak_realtime": "Dün akşam bir müzik mekânındaydın. Uzakta sahneye çıkan grubun Mor ve Köşesi'ne çok benzediğini düşündün; şarkılar ve solistin sesi de benziyordu. Ancak mekân çok kalabalıktı ve sahneyi iyi göremediğin için gerçekten onlar olup olmadığından tam emin olamadın.",
      "own_weak_after": "Bu sabah konser mekânına uğradın. Sahnede Mor ve Köşesi'ninkine benzeyen enstrümanlar ve grubun birkaç şarkısının yazılı olduğu bir set listesi vardı. Ancak o gece aynı sahnede birkaç farklı grubun çaldığını biliyorsun; Mor ve Köşesi'nin gerçekten konser verip vermediğinden emin değilsin.",
      "reportative_strong_realtime": "Büyük bir müzik festivaline giden bir Twitch yayıncısının canlı yayınını kulaklıktan dinliyorsun ama ekrana bakmıyorsun. Yayıncı festivaldeki sahneleri dolaşıp nerede ne olduğunu an be an anlatıyor. Mor ve Köşesi sahneye çıkıp çalmaya başladığı anda da grubun konser vermeye başladığını canlı yayında söylüyor.",
      "reportative_strong_after": "Festivale giden bir arkadaşın daha sonra sana Mor ve Köşesi'nin konser verdiğini anlattı.",
      "reportative_weak_realtime": "Büyük bir müzik festivaline giden bir Twitch yayıncısının canlı yayınını kulaklıktan dinliyorsun ama ekrana bakmıyorsun. Yayıncı festivaldeki sahneleri dolaşıp nerede ne olduğunu an be an anlatıyor ve bir ara Mor ve Köşesi'nin konser verdiğini söylüyor. Ancak Mor ve Köşesi'nin bu festivale katılmayacağını daha önce duyduğun ve yayıncının dikkat çekmek için zaman zaman asılsız şeyler söylediğini bildiğin için bu habere tam güvenemiyorsun.",
      "reportative_weak_after": "Festivale giden, anlattıklarını biraz abartmasıyla tanınan bir arkadaşın sana Mor ve Köşesi'nin konser verdiğini söyledi. Ancak grubun festivale katılmayacağını bildiğin için söylediğine pek inanmadın."
    }
  },
  {
    "id": "crit-06",
    "target": {
      "di": "Nahide'nin arabası bozuldu.",
      "mis": "Nahide'nin arabası bozulmuş."
    },
    "contexts": {
      "own_strong_realtime": "Dün Nahide'yle arabada gidiyordun. Araba birden garip sesler çıkarmaya başladı, motor uyarı ışığı yandı ve birkaç saniye sonra tamamen durdu. Nahide tekrar çalıştırmayı denedi ama araba hareket etmedi.",
      "own_strong_after": "Bugün Nahide'nin evinin önünden geçerken arabasının kaputu açık halde çekici üzerinde olduğunu gördün. Arabanın altında yağ birikmişti ve motor bölümünde sökülmüş parçalar vardı.",
      "own_weak_realtime": "Dün Nahide seni arabasıyla gideceğin yere bıraktı. Tam senin ineceğin yerde durduğunda araba bir süre garip sesler çıkardı ve gösterge panelinde bir uyarı ışığı yandı. Acelen olduğu için arabanın durumunu tam olarak anlayacak kadar kalamadın ama bozulduğundan şüpheleniyorsun.",
      "own_weak_after": "Bugün Nahide'nin arabasını evinin önünde kaputu açık halde gördün. Yerde birkaç alet ve yağ lekesi vardı. Ancak Nahide'nin arabasıyla sık sık kendisinin ilgilendiğini bildiğin için arabanın gerçekten bozulduğundan emin olamadın çünkü sadece bakım yapılıyor da olabilir.",
      "reportative_strong_realtime": "Sen mutfakta yemek yapıyorsun, arkadaşın da balkonda oturup apartmanın otoparkını seyrediyor. Nahide evden çıktığı anda arkadaşın ne yaptığını sana an be an anlatmaya başlıyor: Arabasına biniyor, arabayı çalıştırıyor, birkaç saniye sonra kaputtan duman çıkıyor ve araba tuhaf sesler çıkarmaya başlıyor. Arkadaşın tam o sırada Nahide'nin arabasının bozulduğunu söylüyor.",
      "reportative_strong_after": "Nahide'yle daha sonra karşılaştığında sana arabasının önceki gün bozulduğunu anlattı.",
      "reportative_weak_realtime": "Sen mutfakta yemek yapıyorsun, arkadaşın da balkonda oturup apartmanın otoparkını seyrediyor. Nahide arabasına bindiğinde arkadaşın olanları sana an be an anlatıyor. Araba birkaç kez çalışmayınca arkadaşın hemen Nahide'nin arabasının bozulduğunu söylüyor. Ancak arabanın sadece aküsünün bitmiş olabileceğini düşündüğün için bu yorumdan tam emin değilsin.",
      "reportative_weak_after": "Bir arkadaşın sana Nahide'nin arabasının bozulduğunu söyledi. Ancak arabayı yalnızca çekici üzerinde gördüğünü öğrenince bakım için götürülüyor olabileceğini düşündün."
    }
  },
  {
    "id": "crit-07",
    "target": {
      "di": "Pervin'in atı tepeye kadar koştu.",
      "mis": "Pervin'in atı tepeye kadar koşmuş."
    },
    "contexts": {
      "own_strong_realtime": "Dün Pervin'le kırdaydın. Pervin'in atı patikanın başından hızla koşmaya başladı. Atı bütün yol boyunca gözden kaybetmedin ve tepenin en üst noktasına kadar koştuğunu açıkça gördün.",
      "own_strong_after": "Bu sabah Pervin ve atı koşuya çıktılar. Akşamüstü sen de hava almak için tepeye kadar yürüdün. Patikanın başından zirveye kadar Pervin'in atının nal izlerini kesintisiz biçimde takip ettin. Tepede de atın ayağındaki özel nalın bıraktığı belirgin izi gördün.",
      "own_weak_realtime": "Dün Pervin'le kırdaydın. Pervin'ina atı ve birkaç başka at kırlarda koşup oynadı. Pevin'in atına çok benzeyen atlardan biri tepeye kadar koşup geri geldi, sonra da Pervin'in elinden şeker yedi ama bu atın Pervin'inki olduğundan yüzde yüz emin değilsin.",
      "own_weak_after": "Bu sabah patikada Pervin'in atınınkine benzeyen nal izlerini gördün. İzler tepeye doğru devam ediyordu ancak zirveye yaklaşınca başka atların izleriyle karıştı. Pervin'in atının tepeye kadar koşup koşmadığından emin olamadın.",
      "reportative_strong_realtime": "Radyodan canlı yayınlanan bir at yarışını dinliyorsun. Pervin'in atı parkurdan çıkıp tepeye doğru koşmaya başladığında spiker olanları an be an anlatıyor. At tepenin en üst noktasına ulaştığı anda spiker Pervin'in atının tepeye kadar koştuğunu canlı yayında söylüyor.",
      "reportative_strong_after": "Pervin'le birlikte ata binen bir arkadaşın daha sonra sana Pervin'in atının tepeye kadar koştuğunu anlattı.",
      "reportative_weak_realtime": "Radyodan canlı yayınlanan bir at yarışını dinliyorsun. Spiker bir atın tepeye doğru koşuşunu an be an anlatıyor ve zirveye ulaştığı anda bunun Pervin'in atı olduğunu söylüyor. Ancak yarıştaki iki atın isimlerinin birbirine çok benzediğini ve spikerin bunları daha önce de karıştırdığını bildiğin için tepeye çıkanın gerçekten Pervin'in atı olduğundan emin değilsin.",
      "reportative_weak_after": "Bir arkadaşın sana Pervin'in atının tepeye kadar koştuğunu söyledi. Ancak Pervin'in atına çok benzeyen başka bir atın da o gün aynı yerde olduğunu bildiğin için arkadaşının atları karıştırmış olabileceğini düşündün."
    }
  },
  {
    "id": "crit-08",
    "target": {
      "di": "Doruk'un uçağı piste indi.",
      "mis": "Doruk'un uçağı piste inmiş."
    },
    "contexts": {
      "own_strong_realtime": "Dün havalimanında Doruk'un uçağını bekliyordun. Uçağın uçuş numarasını biliyordun. Uçağın piste yaklaşmasını, tekerleklerinin piste değmesini ve yavaşlayarak terminale doğru ilerlemesini açıkça gördün.",
      "own_strong_after": "Doruk'un uçağının gelmesi gereken saatten biraz sonra havalimanına ulaştın. Doruk'un uçuş numarasını taşıyan uçak terminal kapısında park etmişti; motorları yeni kapanmıştı ve yolcular merdivenden inmeye başlamıştı.",
      "own_weak_realtime": "Dün havalimanında Doruk'un uçağını bekliyordun. Uzakta aynı havayoluna ait bir uçağın piste yaklaşıp indiğini gördün, ancak uçuş numarasını seçemediğin için bunun Doruk'un uçağı olup olmadığından emin olamadın.",
      "own_weak_after": "Havalimanına geç ulaştın. Doruk'un uçuşunun kullanacağı kapının önünde aynı havayoluna ait bir uçak park etmişti ve yerde yeni boşaltılmış bagajlar vardı. Ancak o sırada aynı havayolunun başka bir uçuşunun da inmesi gerektiğini bildiğin için bunun Doruk'un uçağı olup olmadığından emin değilsin.",
      "reportative_strong_realtime": "Bir havalimanında çalışıyorsun ve kule ile yer ekipleri arasındaki canlı telsiz konuşmalarını dinliyorsun. Doruk'un bulunduğu uçak piste yaklaşırken kule görevlisi hareketlerini an be an bildiriyor. Tekerlekler piste değdiği anda da Doruk'un uçağının piste indiğini anons ediyor.",
      "reportative_strong_after": "Doruk daha sonra sana uçağının sorunsuz şekilde piste indiğini anlattı.",
      "reportative_weak_realtime": "Havalimanındaki kule yayınını canlı dinliyorsun. Görevli bir uçağın yaklaşmasını an be an aktarıyor ve uçak piste değdiği anda Doruk'un uçağının indiğini söylüyor. Ancak aynı havayolunun çok benzer saatlerde gelen başka bir uçağı olduğunu bildiğin için görevlinin uçuşları karıştırmış olabileceğinden şüpheleniyorsun.",
      "reportative_weak_after": "Bir arkadaşın sana Doruk'un uçağının piste indiğini söyledi. Ancak aynı havayolunun başka bir uçuşunun da aynı saatlerde geldiğini bildiğin için arkadaşının uçuşları karıştırmış olabileceğini düşündün."
    }
  },
  {
    "id": "crit-09",
    "target": {
      "di": "Begüm ve arkadaşları Bozcaada'da kaldı.",
      "mis": "Begüm ve arkadaşları Bozcaada'da kalmış."
    },
    "contexts": {
      "own_strong_realtime": "Geçen hafta Bozcaada'daydın. Begüm ve arkadaşlarının senin kaldığın pansiyona yerleştiğini gördün. Akşam odalarına çıktılar, ertesi sabah da kahvaltıda tekrar karşılaştınız.",
      "own_strong_after": "Bozcaada'daki bir pansiyona gittin. Begüm'ün üzerinde adı ve soyadı yazılı bavul etiketi odada kalmıştı; odalarda ona ve arkadaşlarına ait kişisel eşyalar, kullanılmış havlular ve birkaç günlük konaklamaya ait izler vardı.",
      "own_weak_realtime": "Geçen hafta Bozcaada'daydın. Uzaktan Begüm ve arkadaşlarına benzeyen bir grubu ellerinde bavullarla bir pansiyona girerken gördün. Arkalarından seslendin ama ya seni duymadılar, ya da Begüm ve arkadaşları değillerdi ve üstlerine alınmadılar.",
      "own_weak_after": "Bozcaada'daki bir pansiyona gittin. Odalardan birinde Begüm'ünkine çok benzeyen bir bavul etiketi ve birkaç kişiye ait kullanılmış eşyalar gördün. Ancak bu eşyaların gerçekten Begüm ve arkadaşlarına ait olup olmadığından tam olarak emin değilsin.",
      "reportative_strong_realtime": "Bozcaada'dan ayrılacak feribottasın. Sen kapalı salonda otururken arkadaşın dış güverteden iskeleyi görebiliyor ve olanları sana an be an anlatıyor. Feribot hareket etmeye başladığı anda Begüm ve arkadaşlarının iskeleye yetişemediğini, kıyıda kaldıklarını ve feribotun onlarsız ayrıldığını söylüyor.",
      "reportative_strong_after": "Begüm'le daha sonra konuştuğunda sana feribotu kaçırdıkları için arkadaşlarıyla Bozcaada'da kaldıklarını anlattı.",
      "reportative_weak_realtime": "Bozcaada'dan ayrılacak feribottasın. Sen içeride otururken arkadaşın dışarıdan iskeleyi izleyip olanları sana an be an anlatıyor. Feribot hareket ettiği anda Begüm ve arkadaşlarının yetişemeyip Bozcaada'da kaldığını söylüyor. Ancak onları oldukça uzaktan gördüğünü ve Begüm sandığı kişinin gerçekten Begüm olup olmadığından çok da emin olmadığını biliyorsun.",
      "reportative_weak_after": "Bir arkadaşın sana Begüm ve arkadaşlarının feribotu kaçırıp Bozcaada'da kaldığını söyledi. Ancak onları uzaktan gördüğünü öğrenince Begüm ve arkadaşlarını başka bir grupla karıştırmış olabileceğini düşündün."
    }
  },
  {
    "id": "crit-10",
    "target": {
      "di": "Kayhan mutfaktaki çöpü attı.",
      "mis": "Kayhan mutfaktaki çöpü atmış."
    },
    "contexts": {
      "own_strong_realtime": "Dün Kayhan'la evdeydin. Mutfaktaki çöp kutusu dolmuştu. Kayhan çöp poşetini kutudan çıkardı, ağzını bağladı ve apartmanın dışındaki çöp konteynerine götürüp attı.",
      "own_strong_after": "Bu sabah mutfağa girdiğinde dün gece ağzına kadar dolu olan çöp kutusunun boş olduğunu gördün. Apartmanın dışındaki konteynerde de Kayhan'ın her zaman kullandığı mavi çöp poşetini gördün. Evde o sırada yalnızca sen ve Kayhan kalıyordunuz, sen de çöpe dokunmadığını biliyorsun.",
      "own_weak_realtime": "Dün mutfaktaydın. Kayhan dolu çöp poşetini kutudan çıkarıp eline aldı ve evden çıktı. Birkaç dakika sonra elleri boş döndü. Çöpü atmaya gittiğini düşündün ama poşeti gerçekten konteynere atıp atmadığını görmedin.",
      "own_weak_after": "Bu sabah mutfaktaki çöp kutusunun boş olduğunu gördün. Kayhan dün gece evdeydi ve genellikle çöpü o atıyor, fakat eve kısa süreliğine gelen başka bir arkadaşınız da vardı. Çöpü kimin attığından tam emin değilsin.",
      "reportative_strong_realtime": "Çok gelişmiş bir akıllı ev sistemin var. Sistem evde yaşayanların yaptıklarını anında telefonuna raporluyor ve sen de o sırada gelen bildirimleri tek tek takip ediyorsun. Sistem Kayhan'ın mutfağa girdiğini, dolu çöp poşetini aldığını, evden çıktığını ve poşeti dışarıdaki konteynere attığını gerçekleştiği anda sana bildiriyor.",
      "reportative_strong_after": "Kayhan daha sonra sana mutfaktaki çöpü attığını söyledi.",
      "reportative_weak_realtime": "Çok gelişmiş bir akıllı ev sistemin var. Sistem evde yaşayanların yaptıklarını anında telefonuna raporluyor ve sen de gelen bildirimleri o anda takip ediyorsun. Sistem Kayhan'ın mutfaktaki çöpü alıp dışarıdaki konteynere attığını anlık olarak bildiriyor. Ancak sistemin Kayhan'la diğer ev arkadaşını zaman zaman birbirine karıştırdığını bildiğin için çöpü gerçekten Kayhan'ın attığından emin değilsin.",
      "reportative_weak_after": "Ev arkadaşın sana Kayhan'ın mutfaktaki çöpü attığını söyledi. Ancak Kayhan'la diğer ev arkadaşının o akşam ikisinin de evde olduğunu bildiğin için kimin attığından tam emin olamadın."
    }
  },
  {
    "id": "crit-11",
    "target": {
      "di": "Poyraz dün gece araba sürdü.",
      "mis": "Poyraz dün gece araba sürmüş."
    },
    "contexts": {
      "own_strong_realtime": "Dün gece Poyraz'la birlikte dışarı çıktınız. Poyraz sürücü koltuğuna oturdu, arabayı çalıştırdı ve gece boyunca seni çeşitli yerlere götürdü. Sen de yol boyunca yanında oturdun.",
      "own_strong_after": "Bu sabah Poyraz'ın arabasına bindiğinde sürücü koltuğunun onun boyuna göre ayarlanmış olduğunu, gece kullandığı montunun sürücü koltuğunda kaldığını ve arabanın kilometre sayacının bir önceki güne göre belirgin biçimde arttığını gördün. Arabayı başka kimsenin kullanmadığını biliyorsun.",
      "own_weak_realtime": "Dün gece uzaktan Poyraz'ın arabasına benzeyen bir arabanın geçtiğini gördün. Direksiyondaki kişi de Poyraz'a çok benziyordu ama hava karanlıktı ve aracı yalnızca birkaç saniye görebildin. Gerçekten Poyraz'ın sürüp sürmediğinden emin değilsin.",
      "own_weak_after": "Bu sabah Poyraz'ın arabasının kilometre sayacının arttığını ve sürücü koltuğunda Poyraz'ın montunu gördün. Ancak Poyraz'ın arabasını zaman zaman kardeşine verdiğini biliyorsun; dün gece arabayı gerçekten Poyraz'ın sürüp sürmediğinden emin değilsin.",
      "reportative_strong_realtime": "Poyraz'ın güvenliği için üzerinde taşıdığı takip cihazını ve arabasındaki araç takip sistemini canlı olarak izliyorsun. Sistem ikisini de anlık olarak raporluyor. Gece Poyraz'ın cihazıyla arabanın aynı anda hareket etmeye başladığını, mahallede birlikte dolaştıklarını ve sonra eve döndüklerini takip ediyorsun; sistem de Poyraz'ın arabayı sürdüğünü anlık olarak bildiriyor.",
      "reportative_strong_after": "Poyraz ertesi gün sana gece arabayla mahallede biraz dolaştığını anlattı.",
      "reportative_weak_realtime": "Poyraz'ın üzerindeki takip cihazını ve arabasındaki araç takip sistemini canlı olarak izliyorsun. Sistem gece Poyraz'ın arabayı sürdüğünü anlık olarak bildiriyor ve araç mahallede dolaşmaya başlıyor. Ancak Poyraz'ın kardeşinin de o sırada onunla birlikte olduğunu ve sistemi kullanan kişiyi bazen yanlış belirlediğini bildiğin için direksiyonda gerçekten Poyraz'ın olup olmadığından emin değilsin.",
      "reportative_weak_after": "Bir arkadaşın sana Poyraz'ın gece araba sürdüğünü söyledi. Ancak Poyraz'ın arabasını kardeşiyle sık sık paylaştığını bildiğin için bu bilgiye tam güvenemedin."
    }
  },
  {
    "id": "crit-12",
    "target": {
      "di": "Akıllı baykuş gece bir fare avladı.",
      "mis": "Akıllı baykuş gece bir fare avlamış."
    },
    "contexts": {
      "own_strong_realtime": "Gece ormanda gözlem yapıyordun. Akıllı baykuşu bir ağacın dalında gördün. Bir süre sonra aşağıdaki fareye doğru hızla uçtu, pençeleriyle fareyi yakaladı ve avıyla birlikte tekrar dala çıktı.",
      "own_strong_after": "Sabah Akıllı baykuşun her zaman konduğu ağacın altında taze fare tüyleri ve küçük kan izleri gördün. Ağacın hemen üzerindeki dalda da baykuşun taze bıraktığı dışkı ve fareden kalmış parçalar vardı. O bölgede o gece gözlemlediğin tek yırtıcı kuş Akıllı baykuştu.",
      "own_weak_realtime": "Gece ormanda gözlem yapıyordun. Akıllı baykuşa çok benzeyen bir baykuşun yere doğru hızla indiğini ve pençelerinde küçük bir hayvanla tekrar havalandığını gördün. Karanlıkta bunun gerçekten Akıllı baykuş mu ve yakaladığı hayvanın fare mi olduğunu tam seçemedin.",
      "own_weak_after": "Sabah Akıllı baykuşun sık bulunduğu ağacın altında fare tüyleri ve küçük kan izleri gördün. Ancak aynı bölgede başka baykuşların da avlandığını biliyorsun; fareyi Akıllı baykuşun avlayıp avlamadığından emin değilsin.",
      "reportative_strong_realtime": "Nesli tehlikede olan, araştırmacıların “Akıllı baykuş” adını verdiği bir baykuşu takip ediyorsun. Ayağındaki gelişmiş takip cihazı yaptığı hareketleri anlık olarak merkeze raporluyor ve sen de gece boyunca bu raporları canlı takip ediyorsun. Sistem baykuşun avlanmaya başladığını ve bir fare yakaladığı anda fare avladığını sana bildiriyor.",
      "reportative_strong_after": "Baykuşu gözlemleyen bir araştırmacı daha sonra sana Akıllı baykuşun gece bir fare avladığını anlattı.",
      "reportative_weak_realtime": "Akıllı baykuşun ayağındaki takip cihazından gelen raporları gece boyunca canlı takip ediyorsun. Sistem baykuş bir şey avladığı anda bunun bir fare olduğunu bildiriyor. Ancak cihazın küçük farelerle başka küçük kemirgenleri zaman zaman karıştırdığını bildiğin için avın gerçekten fare olduğundan emin değilsin.",
      "reportative_weak_after": "Bir araştırmacı sana Akıllı baykuşun gece bir fare avladığını söyledi. Ancak avı yalnızca uzaktan gördüğünü ve bölgede başka küçük kemirgenlerin de yaşadığını öğrenince bunun gerçekten fare olup olmadığından emin olamadın."
    }
  },
  {
    "id": "crit-13",
    "target": {
      "di": "Mars'ta yapılan araştırmada su bulundu.",
      "mis": "Mars'ta yapılan araştırmada su bulunmuş."
    },
    "contexts": {
      "own_strong_realtime": "Mars'tan gelen örnekleri inceleyen araştırma ekibinde çalışıyordun. Mikroskop ve ölçüm cihazlarından gelen verileri analiz ederken örneklerden birinde suya özgü kimyasal özelliklerin açıkça ortaya çıktığını gördün. Farklı ölçümler aynı sonucu verdi.",
      "own_strong_after": "Mars araştırmasının yapıldığı gün laboratuvarda değildin. Ertesi gün çalışma alanına geldiğinde analiz cihazlarının çıktıları hâlâ masadaydı. Mars'tan gelen örneğe ait farklı ölçümlerin hepsinde suya özgü değerler görülüyor, ayrıca örnek kabında ölçümden sonra oluşmuş belirgin su izleri bulunuyordu.",
      "own_weak_realtime": "Mars'tan gelen örnekleri inceleyen araştırma ekibinde çalışıyordun. Analiz sırasında cihazlardan biri suya işaret eden bir değer gösterdi. Ancak sinyal oldukça zayıftı ve cihaz zaman zaman benzer değerleri başka maddelerde de verebiliyordu. Bu yüzden örnekte gerçekten su bulunup bulunmadığından tam emin olamadın.",
      "own_weak_after": "Mars araştırmasının yapıldığı gün laboratuvarda değildin. Ertesi gün çalışma alanına geldiğinde Mars'tan gelen örneğin analiz çıktılarından birinde suya benzeyen bir sinyal gördün. Ancak cihazın yanında kalibrasyon için kullanılan ve benzer bir sinyal oluşturabilecek başka bir madde de vardı. Bu yüzden araştırmada gerçekten su bulunup bulunmadığından emin olamadın.",
      "reportative_strong_realtime": "Mars araştırmasının yapıldığı laboratuvardan canlı yayın yapan bir radyo programını dinliyorsun. Spiker laboratuvarda olanları an be an anlatıyor. Araştırmacılar örneği analiz ettikçe sonuçları aktarıyor; su bulunduğu anda da araştırmada su bulunduğunu canlı yayında duyuruyor.",
      "reportative_strong_after": "Mars araştırmasında çalışan bir arkadaşınla daha sonra karşılaştın. Sana araştırmada Mars'tan gelen örneklerde su bulunduğunu anlattı.",
      "reportative_weak_realtime": "Mars araştırmasının yapıldığı laboratuvardan canlı yayın yapan bir radyo programını dinliyorsun. Spiker laboratuvarda olanları an be an anlatıyor. Analiz tamamlandığı anda araştırmada su bulunduğunu canlı yayında duyuruyor. Ancak bu spikerin bilimsel sonuçları sık sık yanlış yorumladığını bildiğin için söylediğine tam güvenemiyorsun.",
      "reportative_weak_after": "Bilimsel konularda söylediklerine pek güvenmediğin bir arkadaşın sana Mars araştırmasında su bulunduğunu söyledi. Bu tür sonuçları daha önce de yanlış anladığını bildiğin için emin olamadın."
    }
  },
  {
    "id": "crit-14",
    "target": {
      "di": "Vahide Londra'dan muhteşem bir ceket aldı.",
      "mis": "Vahide Londra'dan muhteşem bir ceket almış."
    },
    "contexts": {
      "own_strong_realtime": "Londra'da Vahide'yle alışveriş yapıyordun. Bir mağazada çok şık bir ceket buldu. Ceketi denedi, sen de üzerinde çok beğendin. Sonra kasaya gidip ceketin parasını ödediğini ve çantayla mağazadan çıktığını gördün.",
      "own_strong_after": "Vahide Londra'dan döndükten sonra evine gittin. Gardırobunda daha önce hiç görmediğin çok şık bir ceket vardı. Ceketin üzerinde Londra'daki bir mağazanın etiketi hâlâ duruyordu; cebinde de aynı mağazaya ait, ceketin model numarasıyla eşleşen kart slipi vardı.",
      "own_weak_realtime": "Londra'da Vahide'yle alışveriş yapıyordunuz. Bir mağazada Vahide çok şık bir ceket ve birkaç kıyafet daha denedi, en çok da ceketi beğendi. Sen satış danışmanıyla konuşurken Vahide'nin kasada ödeme yaptığını ve elinde bir paketle mağazadan çıktığını gördün. Ceketi aldığını düşünüyorsun ama çok da emin değilsin.",
      "own_weak_after": "Vahide Londra'dan döndükten sonra evine gittin. Gardırobunda çok şık, yeni görünen bir ceket vardı ve üzerinde Londra'daki bir mağazanın etiketi duruyordu. Ancak Vahide'nin arkadaşlarıyla sık sık kıyafet değiş tokuşu yaptığını bildiğin için ceketi Londra'dan kendisinin mi aldığı, yoksa birinden mi aldığı konusunda emin olamadın.",
      "reportative_strong_realtime": "Vahide Londra'da alışveriş yaparken seninle telefonda konuşuyor ve mağazada yaptıklarını sana an be an anlatıyor. Çok beğendiği bir ceketi denediğini, kasaya götürdüğünü ve parasını ödediğini gerçekleştiği anda söylüyor. Ceketi aldıktan sonra da ne kadar muhteşem olduğunu anlatıyor.",
      "reportative_strong_after": "Vahide Londra'dan döndükten sonra sana alışverişini anlatırken oradan muhteşem bir ceket aldığını söyledi.",
      "reportative_weak_realtime": "Vahide Londra'da alışveriş yaparken seninle telefonda konuşuyor ve yaptıklarını sana an be an anlatıyor. Bir mağazada muhteşem bir ceket bulduğunu ve kasada satın aldığını o anda söylüyor. Ancak Vahide'nin pahalı bulduğu kıyafetleri almaktan vazgeçtiği hâlde bazen sana almış gibi anlattığını bildiğin için ceketi gerçekten satın aldığından emin değilsin.",
      "reportative_weak_after": "Vahide Londra'dan döndükten sonra sana muhteşem bir ceket aldığını söyledi. Ancak alışverişleri konusunda bazen abarttığını veya almadığı şeyleri almış gibi anlattığını bildiğin için söylediğine tam güvenmedin."
    }
  },
  {
    "id": "crit-15",
    "target": {
      "di": "Seyfi önceki gece sahnede kanto yaptı.",
      "mis": "Seyfi önceki gece sahnede kanto yapmış."
    },
    "contexts": {
      "own_strong_realtime": "Önceki gece bir eğlence mekânındaydın. Seyfi sahneye çıktı, kostümünü giydi ve orkestrayla birlikte uzun bir kanto gösterisi yaptı. Sen de sahnenin hemen önünden gösteriyi başından sonuna kadar izledin.",
      "own_strong_after": "Önceki gece Seyfi'nin de bulunduğu bir gösteriye gidemedin. Ertesi gün mekâna uğradığında sahnenin yanında Seyfi'nin üzerinde adı yazılı kostümünü, kullandığı aksesuarları ve kanto gösterisine ait nota kâğıtlarını gördün.",
      "own_weak_realtime": "Önceki gece bir eğlence mekânındaydın. Sahnedeki kişinin Seyfi'ye çok benzediğini ve kanto yaptığını gördün ama ağır makyajı ve kostümü yüzünden gerçekten Seyfi olup olmadığından tam emin olamadın.",
      "own_weak_after": "Ertesi gün gösterinin yapıldığı mekâna uğradın. Sahnenin yanında Seyfi'ninkine çok benzeyen bir kostüm ve kanto gösterisinde kullanılmış aksesuarlar vardı. Seyfi'nin de o gece mekânda olduğunu biliyorsun ama sahneye çıkan kişinin gerçekten o olup olmadığından emin değilsin.",
      "reportative_strong_realtime": "Önceki gece büyük bir fuardan canlı yayın yapan bir radyo kanalını dinliyorsun. Muhabir fuardaki etkinlikleri an be an anlatıyor. Seyfi sahneye çıktığında bunu söylüyor; kanto yapmaya başladığı anda da “Seyfi şu anda sahnede kanto yapıyor” diye canlı yayında aktarıyor.",
      "reportative_strong_after": "Fuara giden bir arkadaşın daha sonra sana Seyfi'nin sahneye çıkıp kanto yaptığını anlattı.",
      "reportative_weak_realtime": "Önceki gece fuardan canlı yayın yapan bir radyo kanalını dinliyorsun. Muhabir etkinlikleri an be an anlatıyor ve Seyfi sahneye çıktığında kanto yaptığını söylüyor. Ancak bu muhabirin kanto ile operayı sık sık birbirine karıştırdığını bildiğin için Seyfi'nin gerçekten kanto yaptığından emin olamıyorsun.",
      "reportative_weak_after": "Fuara giden ama müzik türlerinden pek anlamayan bir arkadaşın sana Seyfi'nin kanto yaptığını söyledi. Ancak arkadaşının kanto ile operayı karıştırdığını bildiğin için emin olamadın."
    }
  },
  {
    "id": "crit-16",
    "target": {
      "di": "Adile bir opera eseri seslendirdi.",
      "mis": "Adile bir opera eseri seslendirmiş."
    },
    "contexts": {
      "own_strong_realtime": "Dün bir konser salonundaydın. Adile sahneye çıktı ve orkestrayla birlikte bir opera eserini başından sonuna kadar seslendirdi. Onu sahneye oldukça yakın bir yerden açıkça gördün ve dinledin.",
      "own_strong_after": "Konserden sonraki gün salona uğradın. Adile'nin üzerinde adı yazılı nota dosyası sahnede duruyordu; dosyanın içinde seslendirilen opera eserinin notaları ve Adile'nin sahne için yaptığı el yazısı işaretlemeler vardı. Mikrofonun yanında da ona ait kişisel eşyaları gördün.",
      "own_weak_realtime": "Dün konser salonundaydın. Sahnedeki kadın Adile'ye çok benziyordu ve bir opera eseri seslendiriyordu, ancak sen salonun en arka sırasında oturuyordun ve yüzünü net seçemedin. Gerçekten Adile olup olmadığından emin olamadın.",
      "own_weak_after": "Konserden sonraki gün salona uğradın. Sahnede bir opera eserinin notaları ve Adile'ninkine benzeyen bir nota dosyası vardı. Adile'nin de konser programında yer aldığını biliyorsun ama o eseri seslendiren kişinin gerçekten o olup olmadığından emin değilsin.",
      "reportative_strong_realtime": "Bir müsamereye gitmeyi çok istiyordun ama son anda gidemeyince arkadaşın Bluetooth kulaklığını takıp sana olanları an be an anlatmayı teklif etti. Adile sahneye çıktığında bunu söylüyor; şarkı söylemeye başladığı anda da bir opera eseri seslendirdiğini sana aktarıyor. Adile söyledikçe arkadaşın da performansı anlatmaya devam ediyor.",
      "reportative_strong_after": "Müsamereye giden bir arkadaşın daha sonra sana Adile'nin bir opera eseri seslendirdiğini anlattı.",
      "reportative_weak_realtime": "Müsamereye gidemediğin için arkadaşın Bluetooth kulaklığıyla olanları sana an be an anlatıyor. Sahneye bir kadın çıktığı anda bunun Adile olduğunu ve bir opera eseri seslendirdiğini söylüyor. Ancak arkadaşının Adile ile ona çok benzeyen Ayşen'i sürekli karıştırdığını bildiğin için gerçekten Adile olup olmadığından emin değilsin.",
      "reportative_weak_after": "Müsamereye giden bir arkadaşın sana Adile'nin bir opera eseri seslendirdiğini söyledi. Ancak Adile ile Ayşen'i sık sık birbirine karıştırdığını bildiğin için söylediğinden emin olamadın."
    }
  },
  {
    "id": "crit-17",
    "target": {
      "di": "Harun NASA'dan iş teklifi aldı.",
      "mis": "Harun NASA'dan iş teklifi almış."
    },
    "contexts": {
      "own_strong_realtime": "NASA'da çalışıyorsun ve arkadaşın Harun bir süre önce seninle aynı departmanda çalışmak için başvurdu. Başvurusunu değerlendiren komitede sen de vardın, Harun'a iş teklifi yapmaya karar verdiniz ve bir mail yolladınız.",
      "own_strong_after": "Bugün Harun'un çalışma masasının üzerinde NASA logolu bir işe giriş paketi, üzerinde Harun'un adı bulunan sözleşme belgeleri ve doldurulmayı bekleyen işe başlangıç formları gördün. Belgelerde belirli bir pozisyon, maaş ve başlangıç tarihi yer alıyordu.",
      "own_weak_realtime": "NASA'da çalışıyorsun ve arkadaşın Harun bir süre önce seninle aynı departmanda çalışmak için başvurdu. Komite Harun'un başvurusunu konuşup değerlendirirken sen de yan ofisteydin. Konuşmaların bir kısmını duydun ve Harun'a bir mail gönderdiklerini gördün. Konuşmalar genel anlamda olumluydu ama iş teklifi gönderilip gönderilmediğinden tam emin değilsin.",
      "own_weak_after": "Bugün Harun'un masasının üzerinde NASA logolu bir klasör, işe giriş formları ve taşınma masraflarıyla ilgili belgeler gördün. Ancak bu formların hiçbirinin üzerinde teklifin yapıldığı kişinin ismini göremedin, bu yüzden evraklar Harun'a mı yoksa başkasına mı ait emin değilsin.",
      "reportative_strong_realtime": "NASA'nın işe alım süreçleri yasa gereği tamamen şeffaf ve kurumun internet sitesinde gelişmeler anlık olarak yayınlanıyor. Arkadaşın Harun'un başvurusunu canlı olarak takip ediyorsun: görüşmeye girdiği, soruların tamamlandığı ve sonunda kendisine iş teklifi yapıldığı gerçekleştiği anda sisteme düşüyor. Sen de sayfayı o sırada açık tuttuğun için güncellemeleri anında görüyorsun.",
      "reportative_strong_after": "NASA'da çalışan bir arkadaşın daha sonra sana Harun'a iş teklifi yapıldığını söyledi.",
      "reportative_weak_realtime": "NASA'nın işe alım süreçleri internet sitesinde anlık olarak yayınlanıyor ve sen de arkadaşın Harun'un sürecini canlı takip ediyorsun. Görüşmenin sonunda sistemde “Harun Yılmaz'a iş teklifi yapıldı” güncellemesi beliriyor. Ancak aynı departmana başvuran aynı isimde iki Harun Yılmaz olduğunu bildiğin için iş teklifini alanın senin arkadaşın olup olmadığından emin değilsin.",
      "reportative_weak_after": "Bir arkadaşın sana Harun'un NASA'dan iş teklifi aldığını söyledi. Ancak aynı isimde başka bir Harun'un da NASA'ya başvurduğunu bildiğin için arkadaşının kişileri karıştırmış olabileceğini düşünüyorsun."
    }
  },
  {
    "id": "crit-18",
    "target": {
      "di": "Cankat sevgilisine evlenme teklifi etti.",
      "mis": "Cankat sevgilisine evlenme teklifi etmiş."
    },
    "contexts": {
      "own_strong_realtime": "Dün Cankat ve sevgilisiyle aynı restorandaydın. Cankat bir ara diz çöktü ve cebinden bir yüzük çıkardı. Sevgilisi mutlulukla ona sarıldı. Olanları masalarının hemen yanından açıkça gördün.",
      "own_strong_after": "Cankat'ın evine ziyarete gittin. Sehpanın üzerinde açık bir yüzük kutusu ve sevgilisinin parmağında da daha önce görmediğin bir yüzük gördün.",
      "own_weak_realtime": "Dün Cankat ve sevgilisinin bulunduğu restorandaydın. Uzaktan Cankat'ın diz çöktüğünü ve sevgilisine küçük bir kutu uzattığını gördün. Ancak çok uzakta olduğun için kutunun içinde yüzük olup olmadığını ve bunun gerçekten evlenme teklifi olup olmadığını anlayamadın.",
      "own_weak_after": "Arkadaşın Cankat'ı evinde ziyarete gittin. Masasının üzerinde boş bir yüzük kutusu ve bir tektaş yüzüğe ait kuyumcu fişi olduğunu gördün. Sevgilisine evlenme teklifi ettiğinden şüpheleniyorsun ama emin değilsin.",
      "reportative_strong_realtime": "Cankat sevgilisiyle botanik bahçesinde buluşuyor. Sen de oradasın ama aranızdaki yüksek duvar yüzünden onları göremiyorsun. Yanındaki arkadaşın ikisini açıkça görebiliyor ve olanları sana an be an anlatıyor: Cankat diz çöküyor, cebinden yüzük kutusunu çıkarıyor ve sevgilisine evlenme teklif ediyor; sevgilisi de sevinçle “Evet!” diyor.",
      "reportative_strong_after": "Cankat'ın sevgilisiyle buluşmasına şahit olan bir arkadaşın daha sonra sana Cankat'ın ona evlenme teklif ettiğini anlattı.",
      "reportative_weak_realtime": "Cankat sevgilisiyle botanik bahçesinde buluşuyor. Sen yüksek duvar yüzünden onları göremiyorsun; yanındaki arkadaşın ise olanları sana an be an anlatıyor. Cankat diz çöktüğü anda arkadaşın sana onun sevgilisine evlenme teklif ettiğini söylüyor. Ancak bu arkadaşının romantik jestleri sık sık evlenme teklifi sanıp abarttığını bildiğin için söylediğine tam güvenemiyorsun.",
      "reportative_weak_after": "O gün botanik bahçesinde olan, olayları biraz abartmasıyla tanınan bir arkadaşın sana Cankat'ın sevgilisine evlenme teklif ettiğini söyledi. Cankat'ın böyle bir planından hiç bahsetmediğini bildiğin için söylediğinden tam emin olamadın."
    }
  },
  {
    "id": "crit-19",
    "target": {
      "di": "Ali'nin evine hırsız girdi.",
      "mis": "Ali'nin evine hırsız girmiş."
    },
    "contexts": {
      "own_strong_realtime": "Dün gece Ali'nin evinin karşısındaki parkta oturuyordun. Bir kişinin pencereyi zorlayarak açtığını, içeri girdiğini ve bir süre sonra elinde Ali'nin televizyonu ve birkaç çantayla çıktığını gördün.",
      "own_strong_after": "Bu sabah Ali'nin evine gittin. Salon penceresinin kilidi kırılmıştı, çekmeceler karıştırılmıştı ve televizyonun bulunduğu yerde yalnızca boş kablolar kalmıştı. Pencerenin altındaki çamurda ayakkabı izleri vardı.",
      "own_weak_realtime": "Dün gece Ali'nin evinin karşısındaki parkta oturuyordun. Karanlıkta birinin pencereyi açıp içeri girdiğini gördün. Kişi etrafına dikkatlice bakıyordu ama yüzünü seçemedin; bunun bir hırsız mı yoksa Ali'nin eve başka yoldan giren bir tanıdığı mı olduğundan emin olamadın.",
      "own_weak_after": "Bu sabah Ali'nin evine gittin. Bir pencerenin camı kırıktı, birkaç çekmece dağınıktı ve televizyon yerinde değildi. Ancak Ali'nin kısa süre önce taşınmak için eşyalarını toplamaya başladığını biliyorsun, o yüzden eve gerçekten hırsız girip girmediğinden emin olamadın.",
      "reportative_strong_realtime": "Polis olarak gece vardiyasında çalışıyorsun ve ekiplerin telsiz konuşmalarını dinliyorsun. Bir ekip Ali'nin yaşadığı sokakta bir hırsızı takip ediyor ve gelişmeleri an be an telsizden aktarıyor. Hırsız Ali'nin evine girdiği anda ekip bunu telsizden bildiriyor.",
      "reportative_strong_after": "Ertesi gün polis olan bir arkadaşın sana Ali'nin evine önceki gece hırsız girdiğini anlattı.",
      "reportative_weak_realtime": "Polis olarak gece vardiyasında çalışıyorsun ve ekiplerin telsiz konuşmalarını dinliyorsun. Bir ekip bir hırsızı takip ediyor ve gelişmeleri an be an telsizden aktarıyor. Hırsız bir eve girdiği anda görevli bunun Ali'nin evi olduğunu söylüyor. Ancak telsizde adresi tam anlayamadığın için söz konusu evin gerçekten Ali'ninki olduğundan emin olamıyorsun.",
      "reportative_weak_after": "Bir arkadaşın sana Ali'nin evine önceki gece hırsız girdiğini söyledi. Ancak Ali'nin kısa süre önce taşındığını ve arkadaşının yeni adresini bilip bilmediğinden emin olmadığını biliyorsun."
    }
  },
  {
    "id": "crit-20",
    "target": {
      "di": "Mustafa dünkü partiye sevgilisini getirdi.",
      "mis": "Mustafa dünkü partiye sevgilisini getirmiş."
    },
    "contexts": {
      "own_strong_realtime": "Dün partide kapıya yakın bir yerde duruyordun. Mustafa'nın sevgilisini daha önce birçok kez görmüştün. Mustafa onunla birlikte geldi, ikisi yan yana kapıdan içeri girdiler ve sen de onları karşıladın.",
      "own_strong_after": "Arkadaşının düzenlediği partiye geldin ama biraz geç kaldın. Herkes çoktan gelmiş ve eğlenmeye başlamış. Zili çalmadan önce kapıdaki ayakkabılara baktın. Mustafa'nın özel yapım botları ve sevgilisinin tüm kış giydiği, kıpkırmızı, üzerinde baş harfleri yazan çizmeleri gördün.",
      "own_weak_realtime": "Dün partide Mustafa'nın yanında bir kadınla içeri girdiğini gördün. Kadın Mustafa'nın daha önce gördüğün sevgilisine çok benziyordu ama kalabalıkta yüzünü net seçemedin; gerçekten sevgilisi olup olmadığından emin olamadın.",
      "own_weak_after": "Arkadaşının düzenlediği partiye geldin ama biraz geç kaldın. Herkes çoktan gelmiş ve eğlenmeye başlamış. Zili çalmadan önce kapıdaki ayakkabılara baktın. Mustafa'nın özel yapım botlarının yanında kırmızı, topuklu çizmeler gördün. Mustafa'nın sevgilisinin de böyle çizmeleri olduğunu biliyorsun ama bu çizmeler ona mı ait emin değilsin.",
      "reportative_strong_realtime": "Partinin yapıldığı apartmanda oturuyorsun. Apartman görevlisi güvenlik nedeniyle binaya girenleri interkomdan anlık olarak duyuruyor. Mustafa ve sevgilisi binaya birlikte girdikleri anda görevli interkomdan Mustafa'nın sevgilisiyle partiye geldiğini anons ediyor.",
      "reportative_strong_after": "Partiye giden bir arkadaşın ertesi gün sana Mustafa'nın sevgilisiyle birlikte geldiğini anlattı.",
      "reportative_weak_realtime": "Partinin yapıldığı apartmanda oturuyorsun. Apartman görevlisi binaya girenleri interkomdan anlık olarak duyuruyor. Mustafa partiye geldiği anda görevli onun sevgilisiyle birlikte geldiğini anons ediyor. Ancak görevlinin Mustafa'yla ona çok benzeyen kuzeni Murat'ı sık sık karıştırdığını bildiğin için duyduğundan tam emin olamıyorsun.",
      "reportative_weak_after": "Partiye giden bir arkadaşın sana Mustafa'nın sevgilisiyle geldiğini söyledi. Ancak bu arkadaşının Mustafa'nın sevgilisini yalnızca birkaç kez gördüğünü bildiğin için yanındaki kadını yanlış tanımış olabileceğini düşünüyorsun."
    }
  },
  {
    "id": "crit-21",
    "target": {
      "di": "İlkkan büyük piyangoyu kazandı.",
      "mis": "İlkkan büyük piyangoyu kazanmış."
    },
    "contexts": {
      "own_strong_realtime": "Dün büyük piyango çekilişini İlkkan'la birlikte izliyordunuz. Açıklanan numaraları onun biletindeki numaralarla tek tek karşılaştırdınız. Son numara da açıklandığında biletteki bütün numaraların büyük ikramiye numaralarıyla eşleştiğini gördünüz.",
      "own_strong_after": "Bugün İlkkan'ın evine gittin. Masasının üzerinde büyük ikramiye numaralarıyla tamamen eşleşen piyango bileti, yanında da piyango idaresinin büyük ikramiye ödemelerinde kullanılan banka dekontu duruyordu. İlkkan'ın hesabına çok büyük miktarda para yatırıldığı görülüyordu.",
      "own_weak_realtime": "İlkkan'la beraber büyük piyango çekilişini televizyondan izliyordunuz. Açıklanan bütün numaralar İlkkan'ın biletindeki numaralarla eşleşti. Tam son numara açıklanırken televizyonun yayın kalitesi düştü, cızırtı yapmaya başladı. O yüzden çok net bir şekilde göremediniz ama görebildiğiniz kadarıyla son numara da İlkkan'ın biletindekiyle eşleşiyor.",
      "own_weak_after": "Bugün İlkkan'ın evine gittiğinde masasında bir piyango bileti, yeni alınmış çok pahalı bir arabanın anahtarı ve büyük miktarda para yatırıldığını gösteren bir banka dekontu gördün. İlkkan'ın piyango oynadığını biliyorsun ama paranın piyangodan mı yoksa başka bir kaynaktan mı geldiğinden emin değilsin.",
      "reportative_strong_realtime": "İlkkan'la mutfakta yemek yapıyorsunuz. Kardeşin salonda büyük piyango çekilişini televizyondan canlı izliyor ve açıklanan sayıları size anında sesleniyor. Son sayı da açıklandığı anda İlkkan'ın elindeki biletle bütün sayıların eşleştiğini fark ediyor ve salondan “İlkkan büyük ikramiyeyi kazandı!” diye bağırıyor.",
      "reportative_strong_after": "Ertesi gün İlkkan'ın kardeşiyle karşılaştın. Sana önceki gece çekilişi izlediğini ve İlkkan'ın büyük ikramiyeyi kazandığını anlattı.",
      "reportative_weak_realtime": "İlkkan'la mutfakta yemek yapıyorsunuz. Kardeşin salonda büyük piyango çekilişini televizyondan canlı izliyor ve açıklanan sayıları size anında sesleniyor. Son sayı açıklandığı anda “İlkkan büyük ikramiyeyi kazandı!” diye bağırıyor. Ancak İlkkan'ın biletindeki son rakam biraz silik olduğu için gerçekten açıklanan rakamla aynı olup olmadığından emin olamıyorsunuz.",
      "reportative_weak_after": "Bir arkadaşın sana İlkkan'ın büyük piyangoyu kazandığını söyledi. Ancak bu arkadaşın İlkkan'ın küçük bir ikramiye mi yoksa büyük ikramiye mi kazandığını tam bilmediğini fark ettin."
    }
  },
  {
    "id": "crit-22",
    "target": {
      "di": "Cenk Salı günü pazarda domates sattı.",
      "mis": "Cenk Salı günü pazarda domates satmış."
    },
    "contexts": {
      "own_strong_realtime": "Salı günü pazardaydın. Cenk'i kendi tezgâhının arkasında gördün. Önünde kasalar dolusu domates vardı; müşterilere domates tartıp poşetlere koyduğunu ve karşılığında para aldığını birkaç kez izledin.",
      "own_strong_after": "Çarşamba günü Cenk'in deposuna uğradın. Salı sabahı dolu olduğunu bildiğin domates kasalarının neredeyse tamamı boştu. Cenk'in pazar tezgâhında kullandığı para kutusunda çok sayıda küçük banknot vardı ve terazinin yanında domates sapları ile ezilmiş birkaç domates duruyordu.",
      "own_weak_realtime": "Salı günü pazardaydın. Uzaktan Cenk'e çok benzeyen birinin domates tezgâhında müşterilere domates tarttığını gördün. Pazar çok kalabalıktı ve kişinin yüzünü net seçemedin; gerçekten Cenk olup olmadığından tam emin olamadın.",
      "own_weak_after": "Çarşamba günü Cenk'in pazar tezgâhının bulunduğu yere uğradın. Salı sabahı dolu olduğunu gördüğün domates kasalarının çoğu boştu ve tezgâhın çevresinde domates sapları vardı. Ancak Cenk'in bazen tezgâhı çalışanına bıraktığını biliyorsun; domatesleri Salı günü bizzat Cenk'in satıp satmadığından emin değilsin.",
      "reportative_strong_realtime": "Zabıta olarak Salı günü pazarda görev yapıyorsun. Pazarın farklı bölümlerini kontrol eden görevliler telsizden gördüklerini an be an merkeze bildiriyor. Cenk müşterilere domates satmaya başladığı anda görevli telsizden Cenk'in tezgâhında domates sattığını bildiriyor.",
      "reportative_strong_after": "Pazarda çalışan bir arkadaşın daha sonra sana Cenk'in Salı günü pazarda domates sattığını anlattı.",
      "reportative_weak_realtime": "Zabıta olarak Salı günü pazarda görev yapıyorsun. Pazarın farklı bölümlerini kontrol eden görevliler telsizden gördüklerini an be an bildiriyor. Bir görevli Cenk'in tezgâhında müşterilere domates sattığını gördüğü anda telsizden Cenk'in domates sattığını söylüyor. Ancak bu görevlinin Cenk'le aynı pazarda çalışan ve ona çok benzeyen Ali'yi sık sık karıştırdığını biliyorsun.",
      "reportative_weak_after": "Pazara giden bir arkadaşın sana Cenk'in Salı günü domates sattığını söyledi. Ancak Cenk'in tezgâhını zaman zaman çalışanına bıraktığını bildiğin için arkadaşının tezgâhı görüp Cenk'in kendisinin orada olduğunu varsaymış olabileceğini düşünüyorsun."
    }
  },
  {
    "id": "crit-23",
    "target": {
      "di": "Raşide'nin kocası parmağını kesti.",
      "mis": "Raşide'nin kocası parmağını kesmiş."
    },
    "contexts": {
      "own_strong_realtime": "Dün Raşide ve kocasıyla mutfakta oturuyordun. Raşide'nin kocası sebze doğrarken bıçak kaydı ve bir kaza oldu. Adamın parmağından kan aktığını ve Raşide'nin hemen yara bandı getirdiğini gördün.",
      "own_strong_after": "Bugün Raşide'yi ziyarete gittin. Kocasının parmağında yeni sarılmış bir sargı bezi vardı. Masada da üzerinde kan lekesi bulunan bir mutfak bıçağı ve yarısı doğranmış sebzeler duruyordu.",
      "own_weak_realtime": "Dün Raşide ve kocasıyla mutfaktaydın. Raşide'nin kocası sebze doğrarken birden elini çekip parmağını tuttu. Parmağında kırmızı bir iz gördün ama uzakta olduğun için bunun gerçekten bir kesik mi yoksa sebzeden bulaşmış bir leke mi olduğunu tam seçemedin.",
      "own_weak_after": "Bugün Raşide'yi eşiyle birlikte yaşadığı evinde ziyarete gittin. Mutfak tezgahında yarısı doğranmış sebzeler, birkaç damla kan ve yara bandı ambalajı gördün ama Raşide'nin elinde herhangi bir yara izi ya da yara bandı yok.",
      "reportative_strong_realtime": "Raşide'nin kocası canlı radyoda yayınlanan bir yemek yarışmasına katılıyor. Sen de evde yayını dinliyorsun. Sunucu yarışmacıların yaptıklarını an be an anlatıyor. Raşide'nin kocası sebzeleri doğrarken bıçak kayıyor ve elini kesiyor.",
      "reportative_strong_after": "Raşide'yle karşılaştığında sana kocasının önceki gün yemek yaparken parmağını kestiğini anlattı.",
      "reportative_weak_realtime": "Raşide'nin kocası canlı radyoda yayınlanan bir yemek yarışmasına katılıyor. Sen de evde yayını dinliyorsun. Sunucu yarışmacıların yaptıklarını an be an, detaylıca anlatıyor. Raşide'nin kocası sebzeleri doğrarken bıçak kayıyor ve kendini kesiyor. Parmağını mı yoksa elini mi kestiğinden emin değilsin.",
      "reportative_weak_after": "Bir arkadaşın sana Raşide'nin kocasının parmağını kestiğini söyledi. Raşide'nin kocası asla yemek yapmaz, o yüzden arkadaşına çok güvenemedin."
    }
  },
  {
    "id": "crit-24",
    "target": {
      "di": "Dünkü partide Mahir gitar çaldı.",
      "mis": "Dünkü partide Mahir gitar çalmış."
    },
    "contexts": {
      "own_strong_realtime": "Dün bir arkadaşının partisindeydin. Mahir bir ara odanın köşesindeki gitarı aldı ve herkesin önünde birkaç şarkı çaldı. Sen de onu başından sonuna kadar izledin.",
      "own_strong_after": "Dün Mahir'le birlikte yaşadığınız evde parti vardı ama sen işlerinden dolayı dışarıdaydın. Geri geldiğinde parti çoktan bitmiş, herkes evine gitmişti. Mahir'in normalde odasında tuttuğu gitarını, penasını ve nota defterini salonda gördün.",
      "own_weak_realtime": "Dün bir partideydin. Kalabalığın arasından birinin gitar çaldığını duydun. Kişi Mahir'e benziyordu ama ışıklar loştu ve oldukça uzaktaydın; gerçekten Mahir olup olmadığından emin olamadın.",
      "own_weak_after": "Dün Mahir'le birlikte yaşadığınız evde parti vardı ama sen işlerinden dolayı dışarıdaydın. Geri geldiğinde parti çoktan bitmiş, herkes evine gitmişti. Salonda bir gitar vardı, belli ki partide çalınmıştı. Bu Mahir'in gitarı mı yoksa davetlilerden birine mi ait emin olamadın.",
      "reportative_strong_realtime": "Eski sevgilin Mahir'in ne yaptığını delicesine merak ettiğin için peşine detektif taktın. Detektif Mahir'i partide de takip etti, kulağına taktığı bluetooth kulaklıkla Mahir'in ne yaptığını sana an be an detaylıca anlattı: Arkadaşlarıyla konuşuyor, kitaplıktaki gitara uzanıyor, gitarı eline alıyor, Akdeniz Akşamları'nı çalıyor...",
      "reportative_strong_after": "Yakın bir arkadaşın Mahir'in de davetli olduğu bir partiye gittiğini, Mahir'in partide gitar çaldığını anlattı.",
      "reportative_weak_realtime": "Eski sevgilin Mahir'in ne yaptığını delicesine merak ettiğin için peşine detektif taktın. Detektif Mahir'i partide de takip etti, kulağına taktığı bluetooth kulaklıkla Mahir'in ne yaptığını sana an be an detaylıca anlattı: Arkadaşlarıyla konuşuyor, kitaplıktaki gitara uzanıyor, gitarı eline alıyor, Akdeniz Akşamları'nı çalıyor... Dedektifin anlık raporlarına güveniyorsun ama gitarla ukuleleyi karıştırdığını bildiğin için emin olamıyorsun.",
      "reportative_weak_after": "Mahir'in de davetli olduğu bir partiye giden ama müzik aletlerinden pek anlamayan bir arkadaşın sana Mahir'in gitar çaldığını söyledi. Ancak bildiğin kadarıyla Mahir gitar değil ukulele çalıyordu, o yüzden emin olamadın."
    }
  },
  {
    "id": "crit-25",
    "target": {
      "di": "Dünkü partide İsmail çıplak dans etti.",
      "mis": "Dünkü partide İsmail çıplak dans etmiş."
    },
    "contexts": {
      "own_strong_realtime": "Dün gece oldukça çılgın bir partiye gittin. Bir ara İsmail kıyafetlerini çıkarıp odanın ortasında müziğe eşlik ederek dans etmeye başladı. Sen de oradaydın ve olanları açıkça gördün.",
      "own_strong_after": "Dün gece arkadaşın İsmail ile bir partiye gittin. Bir süre dans ettikten sonra pistten içecek bir şeyler almak için ayrıldın. Geri döndüğünde İsmail'in gömleği yerdeydi, kendisi de terli ama neşeli bir şekilde pistten ayrılıyordu.",
      "own_weak_realtime": "Dün partideydin. Bir ara ışıklar iyice kısıldı ve kalabalığın ortasında çıplak dans eden birini gördün. Vücut yapısı İsmail'e çok benziyordu ama yüzünü net seçemediğin için gerçekten o olduğundan emin değilsin.",
      "own_weak_after": "Dünkü partide çekilmiş fotoğraflara bakıyordun. Birkaç fotoğrafta İsmail'in gömleğini çıkardığını gördün; başka bir fotoğrafta ise uzakta çıplak dans eden biri vardı ama yüzü görünmüyordu. Bunun İsmail olduğunu düşündün ama emin olamadın.",
      "reportative_strong_realtime": "Dün bir partide arkadaşlarınla gözlerin bağlı şekilde bir oyun oynuyordun. Yanındaki arkadaşın etrafta olanları sana an be an, detaylıca anlatıyordu. Bir ara İsmail'in kıyafetlerini çıkardığını, dans pistine geçtiğini ve çıplak bir şekilde dans etmeye başladığını söyledi. İsmail dans ettiği sürece de ne yaptığını sana anlatmaya devam etti.",
      "reportative_strong_after": "Partiye giden yakın bir arkadaşın ertesi gün sana İsmail'in bir ara bütün kıyafetlerini çıkarıp çıplak bir şekilde dans ettiğini anlattı.",
      "reportative_weak_realtime": "Dün gece bir partiden canlı yayın yapan radyo programını dinliyordun. Muhabir partide olanları an be an anlatıyordu. Bir ara İsmail'in soyunup çıplak bir şekilde dans etmeye başladığını söyledi ve İsmail dans ettikçe olanları aktarmaya devam etti. Ancak bu muhabirin daha önce ten rengi kostüm giyen insanları çıplak sanıp yanlış haber yaptığını bildiğin için İsmail'in gerçekten çıplak olduğundan emin olamadın.",
      "reportative_weak_after": "Partiye giden ama olayları biraz abartarak anlatmasıyla tanınan bir arkadaşın sana İsmail'in çıplak dans ettiğini söyledi. Bildiğin kadarıyla İsmail böyle şeyler yapacak biri değil, o yüzden arkadaşının anlattığına tam olarak inanmadın."
    }
  },
  {
    "id": "crit-26",
    "target": {
      "di": "Şeyma cafede waffle yedi.",
      "mis": "Şeyma cafede waffle yemiş."
    },
    "contexts": {
      "own_strong_realtime": "Dün bir kafede Şeyma'yla oturuyordun. Şeyma kendine waffle sipariş etti ve senin karşında oturup tamamını yedi.",
      "own_strong_after": "Dün Şeyma'nın sık gittiği cafeye gittin, rasgele bir masaya oturdun. Masanın üzerindeki bir kağıt parçası dikkatini çektiği için alıp okudun. Aynı gün erken saatlerden bir fiş olduğunu gördün. Üzerinde Şeyma'nın adı vardı ve bir waffle, bir kahve yazılmıştı.",
      "own_weak_realtime": "Dün bir cafede otururken Şeyma'yı uzakta gördün. Önündeki tabaktan çatalla bir şeyler yiyordu. Tabakta waffle'a benzeyen bir yiyecek vardı ama aranızdaki mesafeden dolayı ne yediğini tam seçemedin.",
      "own_weak_after": "Şeyma'nın hemen her gün gittiği cafeye bir kahve içmek için gittin. Şeyma'nın her zaman oturduğu masanın üzerinde waffle kalıntıları ve Şeyma'nın anaharlığının aynısından vardı. Waffle kalıntılarının üzerindeki sos ve meyveler Şeyma'nın her zamanki siparişine benziyor ama masada oturanın o olup olmadığından emin değilsin.",
      "reportative_strong_realtime": "Bir kafede arkadaşlarınla eğlenceli bir tahmin oyunu oynuyorsunuz. Seninle diğer masalar arasında bir paravan olduğu için Şeyma'yı göremiyorsun. Yanındaki arkadaşın kafede olanları sana an be an anlatıyor. Şeyma'ya waffle geldiği anda bunu söylüyor; Şeyma waffle'dan her lokma aldığında da sana anlık olarak aktarıyor.",
      "reportative_strong_after": "Şeyma'yla aynı kafede oturan bir arkadaşınla daha sonra karşılaştın. Sana Şeyma'nın kafede waffle yediğini anlattı.",
      "reportative_weak_realtime": "Bir yemek festivalinin canlı radyo yayınını dinliyorsun. Muhabir festival alanındaki insanların ne yediğini an be an anlatıyor. Şeyma bir şey yemeye başladığında bunun waffle olduğunu söylüyor ve Şeyma yedikçe canlı yayında aktarmaya devam ediyor. Ancak bu muhabirin waffle ile pankeki sürekli birbirine karıştırdığını bildiğin için Şeyma'nın gerçekten waffle yediğinden emin olamıyorsun.",
      "reportative_weak_after": "Bir arkadaşın sana Şeyma'yı kafede waffle yerken gördüğünü söyledi. Ancak bu arkadaşın waffle ile pankeki birbirinden ayırt edemediğini bildiğin için söylediğinden tam emin olamadın."
    }
  },
  {
    "id": "crit-27",
    "target": {
      "di": "Neslihan bir kız bebek doğurdu.",
      "mis": "Neslihan bir kız bebek doğurmuş."
    },
    "contexts": {
      "own_strong_realtime": "Neslihan'ın doğumunda sağlık çalışanı olarak bulunuyordun. Doğum gerçekleştiğinde bebeği hemen gördün ve kız olduğunu açıkça biliyordun.",
      "own_strong_after": "Neslihan'ın dün doğum yaptığını biliyordun ama hastanede değildin. Bugün onu ziyarete gittin; yanında yeni doğmuş bebeği vardı. Hastane bilekliğinde bebeğin cinsiyeti kız olarak yazıyordu ve Neslihan bebeği sana kızı olarak tanıttı.",
      "own_weak_realtime": "Neslihan'ın doğum yaptığı hastanede çalışıyordun. Doğumhanenin hemen dışında beklerken içeriden bebeğin doğduğunu duydun. Kısa süre sonra bir hemşirenin pembe bir battaniyeye sarılı yeni doğmuş bir bebek taşıdığını gördün. Bunun Neslihan'ın bebeği olduğunu düşünüyorsun ama yüzde yüz emin değilsin.",
      "own_weak_after": "Komşun Neslihan 9 aylık hamile. Önceki gün konuştuğunuzda daha doğum yapmamıştı. Bugün apartmanın girişinde pembe balonlar ve “Hoş geldin prenses” yazılı dekorlar gördün. Bunlardan yola çıkarak Neslihan'ın dün doğurduğunu düşündün ama başka hamile komşuların da var, o yüzden çok emin değilsin.",
      "reportative_strong_realtime": "Görme engellisin. Kız kardeşin Neslihan doğum yaparken yanında olmanı istediği için doğumhaneye girdin. Doğum boyunca yanındaki hemşire olanları sana an be an anlattı. Bebek dünyaya geldiği anda hemşire hemen Neslihan'ın bir kız bebek doğurduğunu söyledi.",
      "reportative_strong_after": "Arkadaşın Neslihan 9 aylık hamileydi. Bu sabah sana bebeğiyle bir fotoğrafını atıp bebeğin doğduğunu ve kız olduğunu haber verdi.",
      "reportative_weak_realtime": "Görme engellisin. Kız kardeşin Neslihan doğum yaparken yanında olmanı istediği için doğumhaneye girdin. Doğum boyunca yanındaki hemşire olanları sana an be an anlattı. Bebek dünyaya geldiği anda hemşire bebeği yalnızca kısa bir an görebildi ve sana “Kız gibi” dedi. Bu yüzden Neslihan'ın bebeğinin gerçekten kız olduğundan yüzde yüz emin olamadın.",
      "reportative_weak_after": "Arkadaşın Neslihan 9 aylık hamileydi. Bu sabah sana bebeğiyle bir fotoğrafını atıp bebeğin doğduğunu haber verdi. Bebeğin battaniyesi pembe gibi duruyor, o yüzden kız olduğunu düşündün ama emin değilsin. Fotoğrafın ışığından dolayı öyle görünüyor olabilir."
    }
  },
  {
    "id": "crit-28",
    "target": {
      "di": "İstanbul'da gece yağmur yağdı.",
      "mis": "İstanbul'da gece yağmur yağmış."
    },
    "contexts": {
      "own_strong_realtime": "Dün gece İstanbul'daydın. Gece boyunca birkaç kez pencerenin önünde oturdun; yağmurun sokaklara ve binalara düştüğünü açıkça gördün ve sesini duydun.",
      "own_strong_after": "Bu sabah İstanbul'da dışarı çıktığında yolların ve kaldırımların tamamen ıslak olduğunu, balkonlarda su biriktiğini gördün. Geceye ait resmî meteoroloji kaydında da İstanbul'da yağış ölçüldüğünü gördün.",
      "own_weak_realtime": "Dün gece İstanbul'daydın. Uykuya dalmak üzereyken dışarıdan yağmura benzeyen sesler duydun. Perdeyi açtığında camda birkaç damla vardı ama karanlıkta dışarıyı iyi göremedin; gerçekten yağmur yağıp yağmadığından emin olamadın.",
      "own_weak_after": "Bu sabah İstanbul'da dışarı çıktığında bazı sokakların ıslak olduğunu ve birkaç yerde su birikintileri bulunduğunu gördün. Ancak belediyenin gece sokakları yıkamış olabileceğini de biliyorsun, bu yüzden gece yağmur yağıp yağmadığından tam emin değilsin.",
      "reportative_strong_realtime": "Ofiste gece vardiyasında çalışıyorsun ve masan pencereden uzakta bir yerde. O yüzden hava durumunu takip edemiyorsun. Masanın yanında oturan arkadaşından hava durumunu sana anlık olarak bildirmesini istedin. Çalışırken bir ara arkadaşın yağmur yağmaya başladığını söyledi. Yağmur devam ettiği sürece sana aralıklı olarak haber verdi, yağmur durduğunda da.",
      "reportative_strong_after": "İstanbul'da yaşayan bir arkadaşınla mesajlaşıyorsun. Sana dün gece yağmur yağdığı için evden çıkmadığını, pencere kenarında oturup kitap okuduğunu anlattı.",
      "reportative_weak_realtime": "Ofiste gece vardiyasında çalışıyorsun ve masan pencereden uzakta bir yerde. O yüzden hava durumunu takip edemiyorsun. Masanın yanında oturan arkadaşından hava durumunu sana anlık olarak bildirmesini istedin. Çalışırken bir ara arkadaşın yağmur yağmaya başladığını söyledi ama hava durumu bu gecenin açık olacağını söylemişti. Arkadaşının yanılıyor olabileceğini düşünüyorsun.",
      "reportative_weak_after": "Sen İzmir'de yaşıyorsun, arkadaşın Derya da İstanbul'da. Bugün onunla telefonda konuşurken sana gece İstanbul'da yağmur yağdığını söyledi. Halbuki hava durumu İstanbul'da havanın açık olacağını söylemişti. O yüzden Derya'ya çok da inanmadın."
    }
  },
  {
    "id": "crit-29",
    "target": {
      "di": "Ankara'da sabaha karşı kar yağdı.",
      "mis": "Ankara'da sabaha karşı kar yağmış."
    },
    "contexts": {
      "own_strong_realtime": "Sabaha karşı Ankara'daydın ve henüz uyumamıştın. Saat 5 civarında pencereden baktığında kar tanelerinin yoğun biçimde yağdığını açıkça gördün.",
      "own_strong_after": "Ankara'da yaşıyorsun. Sabah erken bir saatte uyandın ve evden çıktın. Arabaların, çatıların ve kaldırımların üzerinde taze kar tabakası var.",
      "own_weak_realtime": "Sabaha karşı Ankara'daydın. Pencereden dışarı baktığında sokak lambasının altında havada beyaz taneler gördün ama lambadan uzakta olduğun için bunların kar mı yoksa hafif yağmur mu olduğunu tam seçemedin.",
      "own_weak_after": "Sabah Ankara'da dışarı çıktığında bazı arabaların üzerinde ince beyaz bir tabaka ve kaldırımların birkaç yerinde erimekte olan kar benzeri kalıntılar gördün. Havanın çok soğuk olduğunu biliyorsun ama bunun gerçekten gece yağan kardan mı yoksa kırağıdan mı kaynaklandığından emin değilsin.",
      "reportative_strong_realtime": "Bir havayolu şirketinin operasyon merkezinde gece vardiyasındasın. Ankara Esenboğa'daki kule görevlilerinin pilotlara yaptığı hava durumu anonslarını telsizden dinliyorsun. Sabaha karşı kar başladığı anda görevli, pistte kar yağışının başladığını anons ediyor ve yağış sürerken durumu anlık olarak bildirmeye devam ediyor.",
      "reportative_strong_after": "Ankara'da yaşayan bir arkadaşınla konuştun. Sabaha karşı uyanık olduğunu ve karın yağmasını uzun süre pencereden izlediğini anlattı.",
      "reportative_weak_realtime": "Sabaha karşı şehirlerarası yolculuk yapan şoförlerin kullandığı canlı radyo kanalını dinliyorsun. Ankara'da olduğunu söyleyen bir şoför, kar yağmaya başladığı anda yayına bağlanıp Ankara'da kar yağdığını söylüyor ve yağış sürerken anlık bilgiler vermeye devam ediyor. Ancak bu şoförün bulunduğu yerleri sık sık yanlış söylediğini bildiğin için gerçekten Ankara'da olup olmadığından emin değilsin.",
      "reportative_weak_after": "Sözüne çok da güvenmediğin bir tanıdığın sana sabaha karşı Ankara'da kar yağdığını söyledi."
    }
  },
  {
    "id": "crit-30",
    "target": {
      "di": "Filiz Anna Karenina'yı okudu.",
      "mis": "Filiz Anna Karenina'yı okumuş."
    },
    "contexts": {
      "own_strong_realtime": "Filiz'le beraber kütüphaneye gittiniz. Sen final ödevini yazarken Filiz de bir şeyler okumak istedi. Orada olduğunuz süre boyunca Anna Karenina'yı elinden bırakamadı.",
      "own_strong_after": "Bugün Filiz'le Anna Karenina üzerine uzun uzun konuştunuz. Filiz romanın başından sonuna kadar olayları, karakterlerin gelişimini ve özellikle son bölümleri ayrıntılı biçimde anlattı. Kitabın tamamını okuduğu çok açıktı.",
      "own_weak_realtime": "Filiz'le beraber kütüphaneye gittiniz. Sen final ödevini yazarken Filiz de bir şeyler okumak istedi. Birbirinize biraz uzakta oturduğunuz için elindeki kitabın ismini çok net olarak okuyamadın ama sanki Anna Karenina yazıyordu.",
      "own_weak_after": "Bugün ofise geldiğinde ortak alanda bırakılmış bir Anna Karenina baskısı gördün. Okuyan kişi sayfaları üzerine notlar alınmış, en arka sayfasına da kitap hakkındaki görüşlerini yazmış. Ofiste okumayı en çok seven kişi Filiz ama okuyanın o olduğundan çok emin değilsin.",
      "reportative_strong_realtime": "Yarışmacıların gün boyunca ne yaptığının canlı olarak anlatıldığı bir radyo programını dinliyorsun. Sunucu Filiz'in Anna Karenina okuduğunu an be an aktarıyor. Öyle ki, Filiz sayfa çevirdiğinde dahi anlık olarak söylüyor.",
      "reportative_strong_after": "Filiz dün öğleden sonrayı ev arkadaşıyla beraber evde geçirdi. Daha sonra ev arkadaşıyla karşılaştığında sana Filiz'in uzun süre Anna Karenina okuduğunu anlattı.",
      "reportative_weak_realtime": "Yarışmacıların gün boyunca ne yaptığının canlı olarak anlatıldığı bir radyo programını dinliyorsun. Sunucu Filiz'in Anna Karenina okuduğunu an be an aktarıyor. Öyle ki, Filiz sayfa çevirdiğinde dahi anlık olarak söylüyor. Ancak bu sunucunun kitap isimlerini sık sık birbirine karıştırdığını bildiğin için Filiz'in gerçekten Anna Karenina okuduğundan emin değilsin.",
      "reportative_weak_after": "Çok güvenilir bulmadığın bir arkadaşın sana Filiz'in dün Anna Karenina okuduğunu söyledi. Filiz'i çok uzun zamandır kitap okurken görmediğin için bu bilgiye şüpheyle yaklaşıyorsun."
    }
  },
  {
    "id": "crit-31",
    "target": {
      "di": "İsmail leziz bir pasta yaptı.",
      "mis": "İsmail leziz bir pasta yapmış."
    },
    "contexts": {
      "own_strong_realtime": "Dün İsmail'le mutfaktaydın. İsmail malzemeleri karıştırıp pastayı hazırladı, fırından çıkardı ve üzerini süsledi. Pasta hazır olunca bir dilim yedin; tadı gerçekten çok güzeldi.",
      "own_strong_after": "Bir konferans için dün sabah evden çıktın ve bu sabah geri geldin. Çok aç olduğun için buzdolabını açtın ve leziz bir pasta buldun. Bir dilim yedin. Evde yalnızca sen ve ev arkadaşın İsmail yaşıyor. Eve asla misafir çağırmayan İsmail tatlı yapmayı çok seviyor.",
      "own_weak_realtime": "Büyük bir otelin kalabalık ve kaotik mutfağında çalışıyorsun. Sen kendi istasyonunda yemeklerini yaparken önündeki istasyonda arkası sana dönük bir şekilde çalışan biri muhteşem bir pasta yaptı. Arkadan bakınca arkadaşın İsmail'e benziyordu ama gerçekten İsmail mi yoksa başka biri mi çok emin olamadın.",
      "own_weak_after": "Bir konferans için dün sabah evden çıktın ve bu sabah geri geldin. Çok aç olduğun için buzdolabını açtın ve leziz bir pasta buldun. Bir dilim yedin. Evde yalnızca sen ve ev arkadaşların İsmail ile Yusuf yaşıyor. Yusuf çok nadiren yemek yapıyor, İsmail ise daha sık.",
      "reportative_strong_realtime": "Arkadaşlarınla eğlenceli bir yemek oyunu oynuyorsunuz. Gözlerin bağlı olduğu için mutfakta olanları göremiyorsun. Yanındaki arkadaşın, İsmail'in pasta hazırlarken yaptığı her şeyi sana an be an detaylıca anlatıyor. İsmail pastayı tamamladığı anda arkadaşın bir dilim tadıyor ve sana İsmail'in çok leziz bir pasta yaptığını söylüyor.",
      "reportative_strong_after": "İsmail salı gününü ev arkadaşıyla beraber evde geçirdi. Daha sonra ev arkadaşıyla markette karşılaştığında sana İsmail'in salı günü leziz bir pasta yaptığını anlattı.",
      "reportative_weak_realtime": "Arkadaşlarınla eğlenceli bir yemek oyunu oynuyorsunuz. Gözlerin bağlı olduğu için mutfakta olanları göremiyorsun. Yanındaki arkadaşın, İsmail'in pasta hazırlarken yaptığı her şeyi sana an be an detaylıca anlatıyor. İsmail pastayı tamamladığı anda arkadaşın bir dilim tadıyor ve sana İsmail'in çok leziz bir pasta yaptığını söylüyor. Arkadaşın İsmail'le ikizi Harun'u sürekli birbiriyle karıştırdığı için pastayı yapanın İsmail olup olmadığından emin değilsin.",
      "reportative_weak_after": "İsmail geçen hafta evinde küçük bir davet verdi. Bu davete giden bir arkadaşın İsmail'in kendi yaptığı leziz bir pastayı servis ettiğini anlattı ama bildiğin kadarıyla İsmail'in elinden hiç böyle işler gelmez."
    }
  },
  {
    "id": "crit-32",
    "target": {
      "di": "Utku uzunca bir mektup yazdı.",
      "mis": "Utku uzunca bir mektup yazmış."
    },
    "contexts": {
      "own_strong_realtime": "Dün Utku'yla aynı odada çalışıyordunuz. Utku önüne birkaç sayfa kâğıt koyup bir mektup yazmaya başladı. Uzun süre yazdı; sayfalar doldukça yenilerini ekledi ve sonunda birkaç sayfalık mektubu bitirdiğini gördün.",
      "own_strong_after": "Bugün Utku'nun masasının üzerinde zarfa konulmak üzere hazırlanmış, kendi el yazısıyla yazılmış birkaç sayfalık bir mektup gördün. Mektubun sonunda Utku'nun imzası vardı ve masadaki müsveddelerde de aynı metnin taslakları bulunuyordu.",
      "own_weak_realtime": "Dün Utku'yla aynı odada çalışıyordunuz. Utku'nun uzun süre kâğıda bir şeyler yazdığını gördün. Birkaç kez yanından geçtiğinde önünde birkaç sayfa vardı ama ne yazdığını göremedin; bunun bir mektup olduğunu düşündün.",
      "own_weak_after": "Bugün Utku'nun masasının yanında buruşturulmuş birkaç kâğıt ve boş bir zarf gördün. Kâğıtlardan birinin başında “Sevgili...” yazıyordu ve birkaç sayfa boyunca yazı devam ediyordu. Utku'nun uzun bir mektup yazmış olabileceğini düşündün ama metnin tamamını ya da son hâlini görmedin.",
      "reportative_strong_realtime": "Bir edebiyat festivalinde canlı yayınlanan “mektup yazma maratonu”nu radyodan dinliyorsun. Utku da yarışmacılardan biri. Salondaki sunucu yarışmacıların ne yaptığını an be an anlatıyor. Utku birkaç sayfa yazıp son satırı tamamladığı anda sunucu, Utku'nun uzun mektubunu bitirdiğini canlı yayında duyuruyor.",
      "reportative_strong_after": "Utku'yla aynı odada çalışan bir arkadaşın seni aradı. Önceki gün Utku'nun uzun süre boyunca birkaç sayfalık bir mektup yazdığını ve sonunda tamamladığını başından sonuna kadar gördüğünü anlattı.",
      "reportative_weak_realtime": "Bir televizyon kanalında Biri Bizi Gözetliyor yarışmacılarının gün boyunca ne yaptığını canlı olarak anlatan bir program izliyorsun. Muhabir Utku'nun birkaç saattir masasında bir şeyler yazdığını aktarıyor. Utku birkaç sayfayı tamamlayıp zarfa koyduğu anda muhabir bunun uzun bir mektup olduğunu canlı yayında söylüyor. Ancak bu programın daha önce gördüklerini yanlış yorumlayıp hatalı bilgiler verdiğini bildiğin için muhabirin söylediğine tam olarak güvenmiyorsun.",
      "reportative_weak_after": "Çok güvenilir bulmadığın bir arkadaşın sana Utku'nun uzun bir mektup yazdığını söyledi. Yazdığı şeyin mektup olduğunu Utku'nun önünde bir zarf gördüğü için düşündüğünü söyledi."
    }
  },
  {
    "id": "crit-33",
    "target": {
      "di": "İdris memuriyet sınavını geçemedi.",
      "mis": "İdris memuriyet sınavını geçememiş."
    },
    "contexts": {
      "own_strong_realtime": "İdris'in memuriyet sınavına komite üyesi olarak katıldın. İdris kendisine sorulan sorulara hiç de iyi cevaplar veremedi. O salondan ayrıldıktan sonra komite üyeleri olarak aranızda konuşup İdris'i sınavdan geçirmemeye karar verdiniz.",
      "own_strong_after": "İdris'in memuriyet sınavına girdiği kurumda amir olarak çalışıyorsun. Sınavdan sonra değerlendirmeyi yapan komite sana sınavı geçen ve sınavdan kalan adayların isimlerinin olduğu bir liste verdi. Bu listede İdris'in sınavdan kaldığını gördün.",
      "own_weak_realtime": "İdris'in memuriyet sınavına girdiği kurumda amir olarak çalışıyorsun. İdris komite karşısında sorulara cevap verirken sen de sınavın yapıldığı salonun kapısında bekledin. Kulağını kapıya dayasan da içeride konuşulanları yalnızca boğuk bir şekilde, belli belirsiz duyabildin. Fakat duyduğun kadarıyla İdris çok da parlak bir performans gösteremedi.",
      "own_weak_after": "İdris'le beraber memuriyet sınavının sonuçlarına bilgisayardan bakıyorsunuz. Sayfa ekrana geldiğinde İdris'in puanının geçen seneki taban puanın biraz altında olduğunu gördün, ancak bağlantı hemen kesildiği için karar satırını okuyamadın.",
      "reportative_strong_realtime": "Memuriyet sınavının yapıldığı kurumda çalışıyorsun. Komite toplantısı sırasında alınan kararları kurumun dahili telsizinden an be an duyuran bir görevliyi dinliyorsun. İdris hakkındaki karar verildiği anda görevli telsizden İdris'in sınavı geçemediğini anons ediyor.",
      "reportative_strong_after": "Memuriyet sınavının değerlendirme komitesinde çalışan güvendiğin bir arkadaşınla birkaç gün sonra buluştun. İdris'in sınavını bizzat değerlendirdiğini ve komitenin onu sınavdan geçirmediğini anlattı.",
      "reportative_weak_realtime": "Memuriyet sınavının yapıldığı kurumda çalışıyorsun. Komite toplantısı sırasında alınan kararları kurumun dahili telsizinden an be an duyuran bir görevliyi dinliyorsun. İdris hakkındaki karar verildiği anda görevli telsizden İdris'in sınavı geçemediğini anons ediyor. Ancak bu görevlinin daha önce adayların isimlerini ve sonuçlarını birkaç kez karıştırdığını bildiğin için duyduğun bilgiye tam olarak güvenemiyorsun.",
      "reportative_weak_after": "Sınavdan birkaç gün sonra sözüne pek güvenmediğin bir tanıdığın sana İdris'in sınavdan kaldığını söyledi. Bunu kurumda çalışan başka birinden duyduğunu ama ayrıntıları bilmediğini belirtti. İdris'in sınava iyi hazırlandığını bildiğin için bu bilgiye çok güvenmedin."
    }
  },
  {
    "id": "crit-34",
    "target": {
      "di": "Şarabın hepsini Müjdat içti.",
      "mis": "Şarabın hepsini Müjdat içmiş."
    },
    "contexts": {
      "own_strong_realtime": "Dün akşam Müjdat'la evde oturuyordunuz. Masada yeni açılmış tek bir şişe şarap vardı. Akşam boyunca Müjdat'ın şişeden kendine tekrar tekrar şarap doldurduğunu ve sonunda şişede kalan son şarabı da kadehine döküp içtiğini gördün.",
      "own_strong_after": "Dün akşam evde yalnızca sen ve ev arkadaşın Müjdat vardı. Sen odanda dinlenirken Müjdat da mutfakta oturuyordu. Mutfak masasında bir şişe, açılmamış bir şarap duruyordu. Sabah bu şişenin boş olduğunu gördün.",
      "own_weak_realtime": "Dün akşam Müjdat ve birkaç arkadaşınla evde oturuyordunuz. Masada yeni açılmış tek bir şişe şarap ve başka içkiler vardı. Gece boyunca herkes bir şeyler içti. Hafif çakırkeyif olduğun için şarabı kimin içtiğinden çok emin değilsin ama gördüğün kadarıyla sanki Müjdat içti.",
      "own_weak_after": "Dün akşam ev arkadaşın Müjdat ve onun birkaç arkadaşı evde oturuyordu. Masada tek bir şişe şarap ve başka içkiler vardı. Sen işin olduğu için onlara katılmadın. Sabah ortalığı toplarken şarap şişesinin boş olduğunu gördün. Müjdat'ın arkadaşlarının şarap sevmediğini çok iyi biliyorsun.",
      "reportative_strong_realtime": "Şehrinizdeki bir radyo kanalı bir festivalinden canlı yayın yapıyordu. Sen de evde yayını dinliyorsun. Muhabir, festivalde tanıdığı Müjdat'ın bir şişe şarabı eline alıp tek dikişte bitirmesini an be an, epey detaylı bir şekilde anlattı. Ertesi gün arkadaşın sana şarabın hepsini Mehmet'in mi yoksa Müjdat'ın mı içtiğini sordu.",
      "reportative_strong_after": "Müjdat sevgilisinden ayrıldığı için morali çok bozuk. Önceki gün onunla birlikte oturan arkadaşlarınızdan biri seni arayıp Müjat'ın ne kadar mutsuz olduğunu ve bir şişe şarabı tek başına bitirdiğini anlattı.",
      "reportative_weak_realtime": "Şehrinizdeki bir radyo kanalı bir festivalinden canlı yayın yapıyordu. Sen de evde yayını dinliyorsun. Muhabir, festivalde tanıdığı Müjdat'ın bir şişe içkiyi eline alıp tek dikişte bitirmesini an be an, epey detaylı bir şekilde anlattı. Yalnız Müjdat'ın hepsini içtiği şişenin şarap mı yoksa rakı mı olduğundan emin değilsin, muhabir o detayı söylemedi.",
      "reportative_weak_after": "Sözüne pek güvenmediğin bir arkadaşın sana dün akşam şarabın hepsini Müjdat'ın içtiğini söyledi. Kendisi de partideymiş ama oldukça içkiliymiş ve kimin ne kadar içtiğini tam hatırlamadığını kabul ediyor. Sen de bu yüzden söylediğine çok güvenmiyorsun."
    }
  },
  {
    "id": "crit-35",
    "target": {
      "di": "Misafirler öğleden sonra 3'te geldi.",
      "mis": "Misafirler öğleden sonra 3'te gelmiş."
    },
    "contexts": {
      "own_strong_realtime": "Bugün evde misafir bekledin. Saat tam 3'te kapı çaldı. Kapıyı açtın, beklediğin misafirler karşındaydı.",
      "own_strong_after": "Dün evde misafir vardı ama sen dışarıdaydın. Bugün sitenin giriş kayıtlarına baktın. Misafirlerin isimleri giriş listesinde kayıtlıydı ve giriş saatleri tam 15.00 olarak görünüyordu.",
      "own_weak_realtime": "Dün öğleden sonra eve misafir geldi. Sen odanda ders çalışıyordun, bu yüzden ne misafirleri karşıladın ne de odandan çıktın. Sadece evin zili çaldığında odandaki duvar saatine baktın, 3'ü gösteriyordu. Çalışman bittiğinde saate tekrar baktın, hala 3'ü gösteriyordu. Saatin pilinin bittiğini anladın. Misafirler geldiğinde doğru zamanı mı gösteriyordu, yoksa o zaman da pili bitik miydi emin değilsin.",
      "own_weak_after": "Dün sen dışarıdayken eve misafir geldiğini öğrendin. Annen misafirlerin geldikten kısa bir süre sonra ikindi namazını kılmak için müsaade istediklerini anlattı. Buradan yola çıkarak misafirlerin geliş saatini hesapladın.",
      "reportative_strong_realtime": "Evde değilsin ama annen seni telefonla arıyor ve misafirleri beklerken seninle konuşuyor. Kapı çaldığı anda annen duvardaki saate bakıp saat tam 3 olduğunu söylüyor. Kapıyı açtığında beklenen misafirleri karşısında gördüğünü de aynı anda sana aktarıyor.",
      "reportative_strong_after": "Ertesi gün annenle konuşurken misafirlerin önceki gün saat tam 3'te geldiğini söyledi. Misafirleri bizzat kendisi karşılamış ve kapı çaldığında saate baktığını anlattı.",
      "reportative_weak_realtime": "Evde değilsin ama annen seni telefonla arıyor ve misafirleri beklerken seninle konuşuyor. Kapı çaldığı anda duvardaki saate baktığını ve saatin 3'ü gösterdiğini söylüyor. Bir süre sonra saatin durmuş olduğunu fark ediyor ve sana, misafirler geldiğinde doğru zamanı gösterip göstermediğinden emin olmadığını hemen anlatıyor.",
      "reportative_weak_after": "Birkaç gün sonra annenin sözüne pek güvenmediğin bir arkadaşından misafirlerin öğleden sonra 3 civarında geldiğini duydun. Kendisi orada değilmiş; annenin ikindi namazına kısa süre sonra geçtiğini duyup geliş saatini buradan tahmin etmiş. Bu yüzden misafirlerin tam saat 3'te gelip gelmediğinden emin değilsin."
    }
  },
  {
    "id": "crit-36",
    "target": {
      "di": "Teoman dün bir Mercedes çaldı.",
      "mis": "Teoman dün bir Mercedes çalmış."
    },
    "contexts": {
      "own_strong_realtime": "Dün akşam evinin balkonunda oturuyordun. Komşunun oğlu Teoman'ı sokakta gördün. Bir Mercedes'in kapısını bir süre uğraştıktan sonra zorlayarak açtı ve arabayı sürüp gitti. Teoman'ın bir arabası yok, bundan eminsin.",
      "own_strong_after": "Arkadaşın Teoman bir süredir işsiz ve maddi anlamda zorlanıyor. Dün beraber yürürken çok şık bir Mercedes gördünüz ve Teoman, 'Bu araba benim olacak!' dedi. Bugün sabah ise seni almaya bu Mercedes'le geldi. Teoman'ın bu arabayı satın almasına olanak yok, bundan eminsin.",
      "own_weak_realtime": "Dün akşam evinin balkonunda oturuyordun. Komşunun oğlu Teoman'a çok benzeyen birini sokakta gördün. Bir Mercedes'in kapısını bir süre uğraştıktan sonra zorlayarak açtı ve arabayı sürüp gitti. Teoman'ın Mercedes'i yok, bundan eminsin fakat hava karanlık olduğu için gördüğün kişinin Teoman olup olmadığından tam olarak emin değilsin.",
      "own_weak_after": "Arkadaşın Teoman bir süredir işsiz ve maddi anlamda zorlanıyor. Hatta bir süre önce arabasını satmak zorunda kaldı. Önceki gün arabasızlığın ne kadar zor olduğundan dert yandı, bugün ise seni ziyarete bir Mercedes sürerek geldi. Çok şaşırdın, çünkü Teoman'ın bu arabayı kiralayacak kadar dahi parası yok.",
      "reportative_strong_realtime": "Polis olarak görev yapıyorsun ve Teoman isimli bir şüpheliyi yakından takip ediyorsunuz. Ortağın Teoman'ı fiziksel olarak takip ediyor ve kulağındaki kulaklıkla an be an sana rapor veriyor. Sen de ofiste ortağının söylediklerini dinliyorsun. Ortağın Teoman'ın Mercedes bir marka arabanın kapısını zorlayarak açıp arbaya bindiğini ve uzaklaştığını söylüyor.",
      "reportative_strong_after": "Emniyette hırsız ve kapkaç departmanında çalışan polis bir arkadaşın seni aradı. Teoman'ın bir Mercedes çalmaktan tutuklandığını ve ceza aldığını söyledi.",
      "reportative_weak_realtime": "Polis olarak görev yapıyorsun ve Teoman isimli bir şüpheliyi yakından takip ediyorsunuz. Ortağın Teoman'a çok benzeyen birini fiziksel olarak takip ediyor ve kulağındaki kulaklıkla an be an sana rapor veriyor. Sen de ofiste ortağının söylediklerini dinliyorsun. Ortağın, takip ettiği kişinin Mercedes marka bir arabanın kapısını zorlayarak açıp arabaya bindiğini ve uzaklaştığını o anda sana söylüyor. Ancak hava karanlık ve kişi uzakta olduğu için ortağın, arabaya binen kişinin gerçekten Teoman olup olmadığından tam emin değil.",
      "reportative_weak_after": "Sözüne çok da güvenmediğin bir arkadaşınla buluştun. Muhabbet ederken uzun süredir haber alamadığınız arkadaşınız Teoman'ın Mercedes çalmaktan tutuklanp hapse atıldığını söyledi. Teoman'ın böyle bir şey yapacağına çok ihtimal vermiyorsun."
    }
  },
  {
    "id": "crit-37",
    "target": {
      "di": "Davut, Nemrut Dağı'na çıktı.",
      "mis": "Davut, Nemrut Dağı'na çıkmış."
    },
    "contexts": {
      "own_strong_realtime": "Dün Nemrut Dağı'nın karşısındaki bir tepede dürbünle manzarayı izliyordun. Davut'u patikaya girerken gördün ve hava çok açık olduğu için tırmanışı boyunca onu gözden kaybetmedin. Bir süre sonra zirveye ulaştığını açıkça gördün.",
      "own_strong_after": "Davut dün Nemrut Dağı'na gittiğini söyledi. Sonrasında fotoğraf makinesini çıkartıp sana Nemrut Dağı'nın zirvesinde çektiği çeşitli fotoğrafları ve selfieleri gösterdi.",
      "own_weak_realtime": "Dün Nemrut Dağı'nın karşısındaki bir tepeden manzarayı izliyordun. Davut'a çok benzeyen birinin patikada yukarı doğru ilerlediğini, nihayetinde de zirveye ulaştığını gördün. Hava sisli olduğu için zirveye ulaşan bu kişinin gerçekten Davut olup olmadığından tam emin olamadın.",
      "own_weak_after": "Arkadaşın Ahmet dün Nemrut Dağı'na gitmişti. Dağa tırmanışını videoya kaydetmiş, bugün sana bu videoyu izletti. Görüntüde bir başka arkadaşın Davut'a çok benzeyen biri de patikada ilerliyor ve bir süre sonra zirvede görünüyor, ancak görüntü bulanık olduğu için kişinin gerçekten Davut olduğundan tam emin değilsin.",
      "reportative_strong_realtime": "Nemrut Dağı'nda görev yapan bir arama-kurtarma görevlisi arkadaşınla telsiz bağlantısındasın. Arkadaşın Davut'u patikada görüp takip ediyor ve gördüklerini sana an be an aktarıyor. Davut zirveye ulaştığı anda da hemen sana bunu rapor ediyor.",
      "reportative_strong_after": "Nemrut Dağı'nda rehberlik yapan güvendiğin bir arkadaşın seni aradı. Önceki gün Davut'la aynı rotada yürüdüğünü ve Davut'un Nemrut Dağı'na çıktığını anlattı.",
      "reportative_weak_realtime": "Nemrut Dağı'nda görev yapan bir arama-kurtarma görevlisi arkadaşınla telsiz bağlantısındasın. Arkadaşın Davut'a çok benzeyen birini patikada takip ediyor ve gördüklerini sana an be an aktarıyor. Kişi zirveye ulaştığı anda da hemen bunu sana bildiriyor. Ancak hava sisli olduğu için arkadaşın zirveye çıkan kişinin gerçekten Davut olup olmadığından tam emin değil.",
      "reportative_weak_after": "Sözüne çok da güvenmediğin bir arkadaşınla konuşuyordun. Sana Davut'un geçen gün Nemrut Dağı'na çıkıp zirveye ulaştığını söyledi. Nereden öğrendiğini sorduğunda ortak bir tanıdığınızdan duyduğunu söyledi ama ayrıntıları pek bilmiyordu. Davut'un zaten dağcılıkla pek ilgilenmediğini bildiğin için bu bilgiye çok güvenmedin"
    }
  },
  {
    "id": "crit-38",
    "target": {
      "di": "Perihan Tanju'yu yanağından öptü.",
      "mis": "Perihan Tanju'yu yanağından öpmüş."
    },
    "contexts": {
      "own_strong_realtime": "Dün akşam bir davette Perihan ve Tanju'yla birlikteydin. Vedalaşırken Perihan tam karşında duran Tanju'yu yanağından öptü, senin de elini sıktı.",
      "own_strong_after": "Perihan ve Tanju'nun da katıldığı bir davete gittin. Davetteki tek kadın Perihan'dı ve kırmızı ruj sürüyordu. Bir ara hem Perihan'ı hem de Tanju'yu gözden kaybettin. Tanju'yu tekrar gördüğünde yanağında kocaman bir kırmızı dudak izi vardı.",
      "own_weak_realtime": "Dün akşam bir davette Perihan ve Tanju'yla birlikteydin. Kalabalığın arasından Perihan'a çok benzeyen bir kadının Tanju'yu öptüğünü gördün. Ancak önünden biri geçtiği için o anı tam olarak seçemedin ve Tanju'yu öpen kişinin Perihan olup olmadığından tam emin değilsin.",
      "own_weak_after": "Dün akşam Perihan ve Tanju'nun da katıldığı, kalabalık bir davete gittin. Bir ara hem Perihan'ı hem de Tanju'yu gözden kaybettin. Tanju'yu tekrar gördüğünde yanağında kocaman bir kırmızı dudak izi vardı. Perihan ve Tanju'nun flörtöz bir ilişkisi olduğunu biliyorsun, ama resmen sevgili değiller. O yüzden Tanju'yu kimin öptüğünden tam emin değilsin.",
      "reportative_strong_realtime": "Bir davette çalışan özel güvenlik görevlisi arkadaşınla kulaklık üzerinden konuşuyorsun. Arkadaşın Perihan ve Tanju'yu bulunduğu yerden açıkça görüyor ve olanları sana an be an aktarıyor. Perihan Tanju'yu yanağından öptüğü anda hemen sana “Perihan şimdi Tanju'yu yanağından öptü” diyor.",
      "reportative_strong_after": "Ertesi gün davette bulunan ve Perihan'la Tanju'yu çok iyi tanıyan güvendiğin bir arkadaşın seni aradı. Vedalaşırken Perihan'ın Tanju'yu yanağından öptüğünü kendi gözleriyle gördüğünü anlattı.",
      "reportative_weak_realtime": "Bir davette çalışan özel güvenlik görevlisi arkadaşınla kulaklık üzerinden konuşuyorsun. Arkadaşın Perihan'a çok benzeyen bir kadının Tanju'ya yaklaşıp onu yanağından öptüğünü gördüğü anda bunu hemen sana aktarıyor. Ancak kalabalık ve loş ışık yüzünden kadının gerçekten Perihan olup olmadığından tam emin değil.",
      "reportative_weak_after": "Çok da güvenmediğin bir tanıdığın sana davette Perihan'ın Tanju'yu yanağından öptüğünü söyledi. Kendisi olayı uzaktan gördüğünü ama kalabalık yüzünden çok net seçemediğini belirtti. Perihan'la Tanju'nun yakın olduğunu bildiğin için mümkün buluyorsun ama tanıdığının söylediğinden tam emin olamıyorsun."
    }
  }
] as const;

export const FILLERS = [
  {
    "id": "fill-01",
    "context": "Ev arkadaşın Tamara bir süredir camların silinmesi gerektiğini söylüyor. Sen de ona katılıyorsun ama böylesine derin bir temizlik yapacak zamanın hiç olmuyor.",
    "target": "Evin camları silinse iyi olur.",
    "intended": "good"
  },
  {
    "id": "fill-02",
    "context": "Servet bütün gün hastanede koşturuyor. Eve geldiğinde çok yorgun oluyor. Haberleri izlerken İzlanda’daki bir volkanla ilgili gelişmeleri görüyor ve heyecanla seni arıyor.",
    "target": "Servet kedileri çok sevmiyor.",
    "intended": "bad"
  },
  {
    "id": "fill-03",
    "context": "Buzdolabını açıyorsun ve içeride neredeyse hiçbir şey olmadığını görüyorsun. Akşam birkaç arkadaşın yemeğe gelecek ve evde yemek hazırlamak istiyorsun.",
    "target": "Markete gitmemiz gerekiyor.",
    "intended": "good"
  },
  {
    "id": "fill-04",
    "context": "Ece her sabah işe bisikletle gidiyor. Bisiklet sürmeyi çok seviyor ve arabasını neredeyse hiç kullanmıyor. Bugün de hava güneşli ve yollar açık.",
    "target": "Ece işe arabayla gitmek zorunda.",
    "intended": "bad"
  },
  {
    "id": "fill-05",
    "context": "Arda yarın önemli bir sunum yapacak. Sunumun ilk taslağı henüz hazır değil ve akşam bütün vaktini bunun üzerinde çalışmaya ayırıyor.",
    "target": "Arda’nın bu akşam çalışması gerekiyor.",
    "intended": "good"
  },
  {
    "id": "fill-06",
    "context": "Bütün hafta hava çok sıcak. Defne denize girmek için sabırsızlanıyor ve hafta sonunu sahilde geçirmeyi planlıyor.",
    "target": "Defne kalın kışlık montunu yanında götürse iyi olur.",
    "intended": "bad"
  },
  {
    "id": "fill-07",
    "context": "Mutfaktan yanık kokusu geliyor. Fırının içinden de yoğun duman çıkıyor ve duman alarmı çalıyor.",
    "target": "Fırını hemen kapatmak lazım.",
    "intended": "good"
  },
  {
    "id": "fill-08",
    "context": "Mert’in evinde büyük bir kütüphane var. Her hafta birkaç roman okuyor, arkadaşlarıyla kitaplar hakkında konuşuyor ve sürekli yeni kitaplar alıyor.",
    "target": "Mert kitap okumaktan nefret ediyor.",
    "intended": "bad"
  },
  {
    "id": "fill-09",
    "context": "Otobüsünüz saat sekizde kalkacak. Saat yedi elli ve terminale yürümek en az yirmi dakika sürüyor.",
    "target": "Bir taksi çağırsak iyi olur.",
    "intended": "good"
  },
  {
    "id": "fill-10",
    "context": "Zeynep bütün gün evde. Dışarıda yoğun kar yağıyor ve hava sıcaklığı sıfırın çok altında. Zeynep’in bugün herhangi bir yere gitmesi gerekmiyor.",
    "target": "Zeynep güneş kremi sürmeden dışarı çıkmamalı.",
    "intended": "bad"
  },
  {
    "id": "fill-11",
    "context": "Ali’nin köpeği kapının önünde tasmasıyla bekliyor. Sürekli kapıya bakıyor ve dışarı çıkmak için heyecanla kuyruğunu sallıyor.",
    "target": "Köpeği biraz gezdirmek iyi olabilir.",
    "intended": "good"
  },
  {
    "id": "fill-12",
    "context": "Burcu kahve içemiyor çünkü kafein ona ciddi biçimde dokunuyor. Kafede her zaman bitki çayı sipariş ediyor.",
    "target": "Burcu bir espresso daha istiyor.",
    "intended": "bad"
  },
  {
    "id": "fill-13",
    "context": "Masanın üzerinde önemli belgeler var. Pencere tamamen açık ve dışarıda çok kuvvetli rüzgâr esiyor. Kâğıtların bazıları hareket etmeye başlıyor.",
    "target": "Pencereyi kapatsak iyi olur.",
    "intended": "good"
  },
  {
    "id": "fill-14",
    "context": "Can bütün gün bahçede çalışıyor. Hava çok sıcak ve yanında büyük bir şişe su taşıyor. Her yarım saatte bir su içiyor.",
    "target": "Can susuz kalmamak için hiçbir şey içmiyor.",
    "intended": "bad"
  },
  {
    "id": "fill-15",
    "context": "Yasemin’in yarın sabah erken bir sınavı var. Saat gece yarısını geçiyor ve gözlerini açık tutmakta zorlanıyor.",
    "target": "Yasemin artık uyusa iyi olur.",
    "intended": "good"
  },
  {
    "id": "fill-16",
    "context": "Deniz kırmızı ete karşı ciddi bir alerjisi olduğunu söylüyor. Restoranda menüyü dikkatlice inceliyor ve sadece vejetaryen yemeklere bakıyor.",
    "target": "Deniz biftek sipariş etmek istiyor.",
    "intended": "bad"
  },
  {
    "id": "fill-17",
    "context": "Salondaki ampul sürekli yanıp sönüyor ve artık odayı yeterince aydınlatmıyor. Dolapta yeni bir ampul de var.",
    "target": "Ampulü değiştirmek gerekiyor.",
    "intended": "good"
  },
  {
    "id": "fill-18",
    "context": "Pelin’in çantasında şemsiye var. Dışarıda güneş parlıyor, gökyüzünde tek bir bulut yok ve hava tahmini de yağış göstermiyor.",
    "target": "Pelin kesinlikle yağmurdan korunmak zorunda.",
    "intended": "bad"
  },
  {
    "id": "fill-19",
    "context": "Kerem’in telefonu yüzde bir şarj gösteriyor. Birazdan uzun bir yolculuğa çıkacak ve yol boyunca telefona ihtiyacı olacak. Şarj aleti de hemen yanında duruyor.",
    "target": "Kerem telefonunu şarj etse iyi olur.",
    "intended": "good"
  },
  {
    "id": "fill-20",
    "context": "Nil bütün arkadaşlarını akşam yemeğine davet ediyor. Masada sekiz kişilik yemek hazırlıyor ve herkes saat yedide gelecek.",
    "target": "Nil bu akşam yalnız kalmak istiyor.",
    "intended": "bad"
  },
  {
    "id": "fill-21",
    "context": "Apartmanın giriş kapısı açık kalıyor. Dışarıdan çok soğuk hava geliyor ve içeridekiler üşümeye başlıyor.",
    "target": "Kapıyı kapatmak lazım.",
    "intended": "good"
  },
  {
    "id": "fill-22",
    "context": "Ozan her gün yüzme antrenmanına gidiyor. Havuz evinin hemen karşısında ve antrenmanı birazdan başlayacak.",
    "target": "Ozan yüzmeye gitmek için uçağa binmeli.",
    "intended": "bad"
  },
  {
    "id": "fill-23",
    "context": "Leyla’nın bilgisayarı sürekli kapanıyor ve önemli dosyalarını henüz başka bir yere kopyalamıyor. Bilgisayarın tamamen bozulmasından endişe ediyor.",
    "target": "Dosyalarını yedeklemesi iyi olur.",
    "intended": "good"
  },
  {
    "id": "fill-24",
    "context": "Selim’in evinde çalışan klima odayı oldukça serin tutuyor. Selim de koltukta rahatça oturuyor ve sıcaklıktan memnun olduğunu söylüyor.",
    "target": "Selim dayanılmaz sıcaktan dolayı klimayı tamir ettirmeli.",
    "intended": "bad"
  }
] as const;

export const PRACTICE_TRIALS = [
  {
    id: "practice-01",
    context: "Bora bütün sabah evde dinleniyor. Dışarı çıkmıyor ve herhangi bir spor yapmıyor.",
    target: "Bora sabah maraton koşusuna katılıyor.",
    expectedMin: 1,
    expectedMax: 3,
    explanation: "Bu cümle bağlamla açıkça çelişiyor. Bu sebeple düşük bir skor almalı."
  },
  {
    id: "practice-02",
    context: "Mutfaktan yoğun duman geliyor. Fırının içinden yanık kokusu yükseliyor ve duman alarmı çalıyor.",
    target: "Fırını hemen kapatmak gerekiyor.",
    expectedMin: 5,
    expectedMax: 7,
    explanation: "Bu cümle verilen bağlama uygun. Bu sebeple yüksek bir skor almalı."
  },
  {
    id: "practice-03",
    context: "Elif kafein tüketemiyor. Kafede her zaman bitki çayı söylüyor ve kahveden özellikle kaçınıyor.",
    target: "Elif bir espresso daha istiyor.",
    expectedMin: 1,
    expectedMax: 3,
    explanation: "Bu cümle bağlamla açıkça çelişiyor. Bu sebeple düşük bir skor almalı."
  }
] as const;

export const ATTENTION_CHECKS = [
  {
    id: "attention-01",
    context: "Bu soru, yönergeleri dikkatle okuyup okumadığınızı kontrol etmek için eklenmiştir.",
    target: "Lütfen aşağıdaki skor cetvelinde beş sayısını işaretleyin.",
    requiredRating: 5
  },
  {
    id: "attention-02",
    context: "Bu soru, yönergeleri dikkatle okuyup okumadığınızı kontrol etmek için eklenmiştir.",
    target: "Lütfen aşağıdaki skor cetvelinde iki sayısını işaretleyin.",
    requiredRating: 2
  }
] as const;
