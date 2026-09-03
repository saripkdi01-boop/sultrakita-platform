import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from "react-native";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { searchListings, type Listing } from "@/lib/sultra-api";

const categories = ["Semua", "Properti", "Kendaraan", "Jasa", "Elektronik"];
const formatPrice = (price?: number) => typeof price === "number" ? `Rp ${price.toLocaleString("id-ID")}` : "Harga hubungi seller";

function ListingCard({ item }: { item: Listing }) {
  const colors = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Buka ${item.title}`} onPress={() => router.push(`/listing/${item.id}`)} style={({ pressed }) => [styles.card, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.78 : 1 }]}>
      {item.image_url ? <Image source={item.image_url} contentFit="cover" style={styles.cardImage} /> : <View style={[styles.cardImage, styles.imageFallback, { backgroundColor: "#F5EBDD" }]}><Text style={[styles.fallbackMark, { color: colors.primary }]}>SK</Text></View>}
      <View style={styles.cardBody}>
        <Text numberOfLines={1} style={[styles.price, { color: "#064E4A" }]}>{formatPrice(item.price)}</Text>
        <Text numberOfLines={2} style={[styles.cardTitle, { color: colors.foreground }]}>{item.title}</Text>
        <Text numberOfLines={1} style={[styles.meta, { color: colors.muted }]}>{item.district || item.city || "Sulawesi Tenggara"} · {item.seller_name || item.seller?.name || "Seller lokal"}</Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true); else setLoading(true);
    setError(undefined);
    const result = await searchListings({ q: query, category: activeCategory === "Semua" ? "" : activeCategory });
    setListings(result.data || []);
    setError(result.error);
    setLoading(false);
    setRefreshing(false);
  }, [activeCategory, query]);

  useEffect(() => { const timer = setTimeout(() => { void load(); }, 0); return () => clearTimeout(timer); }, [load]);

  return (
    <ScreenContainer containerClassName="bg-background" className="px-5">
      <FlatList
        data={listings}
        keyExtractor={(item) => String(item.id)}
        numColumns={2}
        columnWrapperStyle={styles.column}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={colors.primary} />}
        ListHeaderComponent={<View>
          <View style={styles.headerRow}><View><Text style={[styles.kicker, { color: "#E87561" }]}>SULTRAKITA</Text><Text style={[styles.heading, { color: colors.foreground }]}>Temukan yang dekat.</Text></View><View style={styles.headerActions}><Pressable accessibilityRole="button" accessibilityLabel="Buat listing" onPress={() => router.push("/create")} style={[styles.addButton, { backgroundColor: "#E87561" }]}><Text style={styles.addText}>+</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel="Buka akun" onPress={() => router.push("/(tabs)/account")} style={[styles.avatar, { backgroundColor: colors.primary }]}><Text style={styles.avatarText}>S</Text></Pressable></View></View>
          <Text style={[styles.subheading, { color: colors.muted }]}>Produk, jasa, dan cerita baik dari warga Sulawesi Tenggara.</Text>
          <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}><Text style={[styles.searchIcon, { color: colors.muted }]}>⌕</Text><TextInput value={query} onChangeText={setQuery} onSubmitEditing={() => load()} placeholder="Cari di sekitar Kendari..." placeholderTextColor={colors.muted} returnKeyType="search" style={[styles.searchInput, { color: colors.foreground }]} /></View>
          <FlatList horizontal showsHorizontalScrollIndicator={false} data={categories} keyExtractor={(item) => item} contentContainerStyle={styles.chips} renderItem={({ item }) => <Pressable onPress={() => setActiveCategory(item)} style={[styles.chip, { backgroundColor: activeCategory === item ? colors.primary : colors.surface, borderColor: activeCategory === item ? colors.primary : colors.border }]}><Text style={{ color: activeCategory === item ? "#FFFFFF" : colors.muted, fontWeight: "700" }}>{item}</Text></Pressable>} />
          <View style={[styles.hero, { backgroundColor: "#064E4A" }]}><View style={styles.heroCopy}><Text style={styles.heroEyebrow}>RUANG LOKAL</Text><Text style={styles.heroTitle}>Belanja dengan rasa percaya.</Text><Text style={styles.heroText}>Dukung seller lokal, temukan peluang baru.</Text></View><Text style={styles.heroWave}>⌁</Text></View>
          <View style={styles.sectionRow}><Text style={[styles.sectionTitle, { color: colors.foreground }]}>Listing terbaru</Text><Text style={[styles.sectionHint, { color: colors.muted }]}>{listings.length ? `${listings.length} ditemukan` : "Jelajahi sekarang"}</Text></View>
        </View>}
        renderItem={({ item }) => <ListingCard item={item} />}
        ListEmptyComponent={<View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}>{loading ? <><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Memuat listing...</Text><Text style={[styles.meta, { color: colors.muted }]}>Menghubungkan ke data SultraKita.</Text></> : <><Text style={[styles.emptyTitle, { color: colors.foreground }]}>{error ? "Feed belum terhubung" : "Belum ada listing"}</Text><Text style={[styles.meta, { color: colors.muted }]}>{error || "Coba ubah kata kunci atau kategori."}</Text><Pressable onPress={() => load()} style={[styles.retry, { backgroundColor: colors.primary }]}><Text style={styles.retryText}>Coba lagi</Text></Pressable></>}</View>}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({ content: { paddingTop: 12, paddingBottom: 32 }, headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerActions: { flexDirection: "row", alignItems: "center", gap: 10 }, addButton: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" }, addText: { color: "#FFFFFF", fontSize: 25, lineHeight: 28, fontWeight: "400" }, kicker: { fontSize: 12, letterSpacing: 2.2, fontWeight: "800" }, heading: { fontSize: 30, lineHeight: 36, fontWeight: "800", marginTop: 4 }, subheading: { fontSize: 15, lineHeight: 22, marginTop: 8, maxWidth: 320 }, avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" }, avatarText: { color: "#FFFFFF", fontWeight: "800", fontSize: 18 }, searchBox: { height: 54, borderRadius: 16, borderWidth: 1, flexDirection: "row", alignItems: "center", paddingHorizontal: 16, marginTop: 22 }, searchIcon: { fontSize: 28, marginRight: 8 }, searchInput: { flex: 1, fontSize: 15 }, chips: { gap: 8, paddingVertical: 16 }, chip: { borderWidth: 1, borderRadius: 99, paddingHorizontal: 16, paddingVertical: 10 }, hero: { minHeight: 148, borderRadius: 22, padding: 20, flexDirection: "row", overflow: "hidden" }, heroCopy: { flex: 1 }, heroEyebrow: { color: "#A9E1D0", fontSize: 11, letterSpacing: 1.5, fontWeight: "800" }, heroTitle: { color: "#FFFFFF", fontSize: 24, lineHeight: 28, fontWeight: "800", marginTop: 8 }, heroText: { color: "#D5F0E9", fontSize: 13, marginTop: 8 }, heroWave: { color: "#E87561", fontSize: 90, fontWeight: "200", transform: [{ rotate: "-18deg" }], marginTop: 20 }, sectionRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginTop: 24, marginBottom: 12 }, sectionTitle: { fontSize: 20, fontWeight: "800" }, sectionHint: { fontSize: 12 }, column: { gap: 12, marginBottom: 12 }, card: { flex: 1, borderRadius: 18, borderWidth: 1, overflow: "hidden", minWidth: 0 }, cardImage: { width: "100%", height: 130 }, imageFallback: { alignItems: "center", justifyContent: "center" }, fallbackMark: { fontSize: 26, fontWeight: "900", letterSpacing: 1 }, cardBody: { padding: 12 }, price: { fontSize: 14, fontWeight: "800" }, cardTitle: { fontSize: 14, fontWeight: "700", lineHeight: 19, marginTop: 5, minHeight: 38 }, meta: { fontSize: 12, lineHeight: 17 }, empty: { borderRadius: 18, borderWidth: 1, padding: 24, alignItems: "center", marginTop: 4 }, emptyTitle: { fontSize: 16, fontWeight: "800", textAlign: "center" }, retry: { paddingHorizontal: 18, paddingVertical: 11, borderRadius: 99, marginTop: 16 }, retryText: { color: "#FFFFFF", fontWeight: "800" } });
