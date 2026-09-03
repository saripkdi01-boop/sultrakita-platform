import { StyleSheet, Text, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function ActivityScreen() {
  const colors = useColors();
  return <ScreenContainer className="px-5" containerClassName="bg-background"><View style={styles.content}><Text style={[styles.kicker, { color: "#E87561" }]}>PUSAT AKTIVITAS</Text><Text style={[styles.title, { color: colors.foreground }]}>Tetap dekat dengan komunitas.</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Notifikasi listing, pesan seller, dan kontribusi akan muncul di sini.</Text><View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.border }]}><View style={[styles.icon, { backgroundColor: colors.primary }]}><Text style={styles.iconText}>•</Text></View><Text style={[styles.emptyTitle, { color: colors.foreground }]}>Belum ada aktivitas</Text><Text style={[styles.emptyText, { color: colors.muted }]}>Mulai jelajahi listing untuk menemukan hal-hal baru di sekitar kamu.</Text></View></View></ScreenContainer>;
}
const styles = StyleSheet.create({ content: { paddingTop: 18 }, kicker: { fontSize: 12, letterSpacing: 1.8, fontWeight: "800" }, title: { fontSize: 30, lineHeight: 36, fontWeight: "800", marginTop: 8 }, subtitle: { fontSize: 15, lineHeight: 22, marginTop: 10 }, empty: { borderWidth: 1, borderRadius: 22, padding: 26, alignItems: "center", marginTop: 32 }, icon: { width: 50, height: 50, borderRadius: 25, alignItems: "center", justifyContent: "center" }, iconText: { color: "#FFFFFF", fontSize: 30, lineHeight: 34 }, emptyTitle: { fontSize: 17, fontWeight: "800", marginTop: 16 }, emptyText: { fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 8 } });
