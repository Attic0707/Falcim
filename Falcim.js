import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Share,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const BACKGROUNDS = [
  require("./assets/backgrounds/background1.jpg"),
  require("./assets/backgrounds/background2.jpg"),
];

const RESPONSES_BY_CATEGORY = {
  love: [
    "Kalbinde uzun zamandır taşıdığın bir şey var, kimseye söylemesen de seni zaman zaman düşüncelere sürükleyen bir his. Aşka kapıları tamamen kapatmamışsın ama kolay kolay kimseye güvenmek istemediğin için kalbin biraz yavaş açılıyor. Yakında biriyle öyle bir sohbetin olacak ki, konuşmanın doğal akışı bile sana iyi gelecek. Bu kişiyle ilgili hislerin ilk başta belirsiz olsa da, tanıdık bir sıcaklık hissedeceksin. Kendini zorlamadan, akışta kalarak ilerlersen kalbinin uzun zamandır özlediği o hafifliği yeniden yaşayabilirsin.",
  ],
  money: [
    "Son zamanlarda para konusunda aklından geçenler seni biraz sıkmış olabilir; plan yapmak istiyorsun ama ufak tefek belirsizlikler seni yavaşlatıyor. Buna rağmen kontrolü tamamen kaybetmemişsin, sadece daha net bir yol görmek istiyorsun. Yakın gelecekte beklenmedik bir kaynak, ufak bir ödeme ya da ertelediğin bir iş sana maddi açıdan rahat nefes aldırabilir. Bu rahatlama, yeniden düzen kurman için güzel bir fırsat olacak. Harcamalarında daha bilinçli davrandıkça, gelecekte kendine daha sağlam bir zemin hazırladığını fark edeceksin.",
  ],
  family: [
    "Aile içinde görünürde büyük bir sorun yok gibi duruyor fakat bazı sessiz düşünceler ve açıklanmamış duygular havada asılı kalmış. Birinin sana söyleyemediği bir şey var; aslında ihtiyaç duyduğu yalnızca biraz ilgi ve güven hissi. Sen yine her zamanki gibi köprü kuran taraf olabilirsin. Küçük bir telefon, kısa bir ziyaret ya da samimi birkaç cümle bile buzları eritmeye yeter. Senin sıcak yaklaşımın aile içinde beklemediğin kadar güzel bir değişimi başlatabilir.",
  ],
  business: [
    "Kafanda bir süredir bekleyen bir fikir var; önce küçük bir heves gibi başlamış ama zamanla daha ciddi bir düşünceye dönüşmüş. Ne kadar doğru olur, nasıl başlarım, yeterli zamanım var mı gibi sorular seni durduruyor. Fakat bu fikrin içinde seni heyecanlandıran bir potansiyel var. Önümüzdeki haftalarda biriyle yapacağın bir konuşma veya karşılaşacağın bir fırsat bu düşünceyi daha görünür hale getirecek. Ufak bir adımla başlarsan, düşündüğünden daha fazla ilerleme kaydedebilirsin.",
  ],
  friendship: [
    "Sosyal çevrende bazı ilişkiler seni son zamanlarda biraz yormuş olabilir. Enerjini emen, seni anlamayan veya tek taraflı ilerleyen bağlar var. Buna rağmen gerçekten değer verdiğin birkaç kişi sana fark ettirmeden güç veriyor. Yakında bir arkadaşınla daha derin bir konuşma yapabilir veya kopmuş bir bağın yeniden canlanabilir. İçtenlikle kurulan iletişim, seni uzun zamandır hissetmediğin bir yakınlıkla buluşturabilir. Kendine iyi gelen ilişkileri korudukça, etrafındaki denge de yerine oturacak.",
  ],
  school: [
    "Zihnin çok yoğun, öğrenmek istediğin şeyler de var ama bazen nereden başlayacağını bilemediğin için ertelemeye kayıyorsun. Buna rağmen içinde güçlü bir potansiyel saklı. Küçük bir düzen değişikliği, basit bir çalışma planı ya da kısa bir odaklanma süresi bile seni fark edilir şekilde ileri taşıyacak. Yakında biri sana motive edici bir cümle söyleyebilir veya beklemediğin bir şekilde ilham alabilirsin. Kendine bir şans verdiğinde başarının hiç de uzak olmadığını göreceksin.",
  ],
  work: [
    "Çalışma hayatında aynı anda hem memnun hem de biraz sıkışmış hissettiğin bir dönemdesin. Bazı şeyler yolunda gidiyor ama içten içe daha yaratıcı, daha huzurlu ya da daha esnek bir düzen arıyorsun. Yakında iş ortamında bir değişiklik, yeni bir görev ya da farklı bir sorumluluk gündeme gelebilir. Bu değişim ilk başta küçük görünse de sana nefes aldıracak. Kendini ifade ettiğinde, fikirlerin sandığından daha fazla değer görecek.",
  ],
  wants: [
    "Kalbinde uzun zamandır sakladığın bir dilek var; sessiz ama güçlü. Bu isteğin bazı günler uzak, bazı günler çok yakın geliyor. Evren senden büyük bir risk değil, sadece küçücük bir adım istiyor. Belki yeni bir alışkanlık, belki küçük bir hazırlık, belki de sadece niyetini netleştirmek… Yakın günlerde hislerine yön veren bir işaret alabilirsin. O an geldiğinde, ertelemeye alışmış tarafını bir kenara bırakıp cesurca devam edersen dileğinin yolları kendiliğinden açılacak.",
  ],
  fears: [
    "İçinde bastırdığın bazı endişeler var; bunları kimseye anlatmamış olsan da kararlarını derinden etkiliyor. Geçmişte yaşadığın deneyimler seni daha dikkatli yapmış ama aynı zamanda adım atmaktan biraz çekinir hale getirmiş. Fakat artık eski sen değilsin; olgunlaştın, güçlendin ve bazı şeyleri çok daha sağlıklı ele alabiliyorsun. Yakında küçük bir cesaret göstermen gereken bir an olacak. O anda korkunun sesini değil, içindeki bilge tarafı dinlersen her şey düşündüğünden daha kolay ilerleyecek.",
  ],
  regrets: [
    "Zamanında yapmadığın bir konuşma, söyleyemediğin bir söz veya kaçırdığın bir fırsat zaman zaman aklına geliyor. Bu his seni bazen hüzünlendiriyor ama aynı zamanda bugünkü kararlarını daha bilinçli almanı sağlıyor. Geçmişteki o küçük pişmanlıklar aslında bugün sana rehberlik ediyor. Yakın zamanda geçmişten gelen biriyle ya da eski bir konuyla yüzleşme şansı bulabilirsin. Bu kez daha açık, daha net ve daha kendin olarak davranacaksın. Bu yüzleşme seni şaşırtıcı biçimde hafifletebilir.",
  ],
};

const CATEGORY_KEYS = Object.keys(RESPONSES_BY_CATEGORY);

const getRandomFromArray = (arr) => {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
};

const getRandomCombinedText = () => {
  if (CATEGORY_KEYS.length === 0) return "";

  const firstIndex = Math.floor(Math.random() * CATEGORY_KEYS.length);
  let secondIndex = Math.floor(Math.random() * CATEGORY_KEYS.length);

  while (secondIndex === firstIndex && CATEGORY_KEYS.length > 1) {
    secondIndex = Math.floor(Math.random() * CATEGORY_KEYS.length);
  }

  const cat1 = CATEGORY_KEYS[firstIndex];
  const cat2 = CATEGORY_KEYS[secondIndex];

  const text1 = getRandomFromArray(RESPONSES_BY_CATEGORY[cat1]);
  const text2 = getRandomFromArray(RESPONSES_BY_CATEGORY[cat2]);

  return text1 + "\n\n" + text2;
};

export default function Falcim() {
  const [imageUri, setImageUri] = useState(null);
  const [randomText, setRandomText] = useState("");
  const [backgroundSource, setBackgroundSource] = useState(BACKGROUNDS[0]);

  // Animation value for shine
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // pick random background
    const idx = Math.floor(Math.random() * BACKGROUNDS.length);
    setBackgroundSource(BACKGROUNDS[idx]);
  }, []);

  useEffect(() => {
    // looped shine animation over the button
    Animated.loop(
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 2500,
        useNativeDriver: true,
      })
    ).start();
  }, [shineAnim]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Devam etmek için galeri erişim izni vermen gerekiyor.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const pickedUri = result.assets?.[0]?.uri || null;
      setImageUri(pickedUri);
      setRandomText(getRandomCombinedText());
    }
  };

  const handleShare = async () => {
    if (!randomText) return;

    try {
      await Share.share({
        message: randomText,
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  const handleReupload = () => {
    pickImage();
  };

  const isInitialState = !imageUri && !randomText;

  // map animation [0..1] to movement across the circle
  const shineTranslateX = shineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-260, 260], // move across entire button width
  });

  return (
    <ImageBackground
      source={backgroundSource}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {isInitialState && (
          <View style={styles.centerWrapper}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={pickImage}
              activeOpacity={0.9}
            >
              {/* Glare / Shine overlay */}
              <Animated.View
                pointerEvents="none"
                style={[
                  styles.shineOverlay,
                  {
                    transform: [
                      { translateX: shineTranslateX },
                      { rotate: "25deg" },
                    ],
                  }, ]} />
              <Text style={styles.circleText}>
                Neyse halim {"\n"} Çıksın falim
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {!isInitialState && (
          <View style={styles.resultWrapper}>
            <Text style={styles.heading}>falcım baktı falına... </Text>

            <View style={styles.textBoxContainer}>
              <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.randomText}>{randomText}</Text>
              </ScrollView>
            </View>

            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <Text style={styles.buttonText}>Paylaş</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reuploadButton}
                onPress={handleReupload}
              >
                <Text style={styles.buttonText}>Tekrar Seç</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "rgba(5, 8, 22, 0.7)",
  },

  centerWrapper: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  circleButton: {
    width: 200,
    height: 100,
    borderRadius: 130,
    backgroundColor: "#f4b41a",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 18,
    elevation: 12,
    overflow: "hidden",
  },
  shineOverlay: {
    position: "absolute",
    top: -40,
    left: -80,
    width: 120,
    height: 340,
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    borderRadius: 60,
  },
  circleText: {
    color: "#e6e6e6ff",
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 30,
  },
  resultWrapper: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 24,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f8f8ff",
    textAlign: "center",
    marginBottom: 20,
  },
  textBoxContainer: {
    flex: 1,
    backgroundColor: "#111827",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#374151",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 12,
  },
  randomText: {
    color: "#e5e7eb",
    fontSize: 16,
    lineHeight: 24,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  shareButton: {
    flex: 1,
    backgroundColor: "#10b981",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  reuploadButton: {
    flex: 1,
    backgroundColor: "#6366f1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#f9fafb",
    fontSize: 16,
    fontWeight: "600",
  },
});