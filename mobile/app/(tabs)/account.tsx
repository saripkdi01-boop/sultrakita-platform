import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { requestOtp, verifyOtp } from "@/lib/sultra-api";
import { saveSession } from "@/lib/session";

export default function AccountScreen() {
  const colors = useColors();
  const [channel, setChannel] = useState<"email" | "whatsapp">("email");
  const [destination, setDestination] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("Kode berlaku lima menit dan tidak boleh dibagikan.");
  const [busy, setBusy] = useState(false);
  const [requested, setRequested] = useState(false);

  async function submit() {
    setBusy(true);
    setMessage("Menghubungkan ke SultraKita...");
    const payload = channel === "email" ? { channel, email: destination } : { channel, phone: destination };
    const result = code ? await verifyOtp({ ...payload, code }) : await requestOtp(payload);
    setBusy(false);
    if (result.error) return setMessage(result.error);
    if (code && result.data && "token" in result.data) await saveSession(result.data.token);
    setRequested(true);
    const destinationLabel = result.data && "destination" in result.data ? result.data.destination : "akun Anda";
    setMessage(code ? "Berhasil diverifikasi. Selamat datang di SultraKita." : `Kode dikirim ke ${destinationLabel}.`);
  }

  return <ScreenContainer className="px-5" containerClassName="bg-background"><View style={styles.content}>
    <Text style={[styles.kicker, { color: "#E87561" }]}>AKUN SULTRAKITA</Text>
    <Text style={[styles.title, { color: colors.foreground }]}>Masuk untuk ikut tumbuh.</Text>
    <Text style={[styles.subtitle, { color: colors.muted }]}>Simpan listing, chat seller, dan kelola kontribusimu di satu tempat.</Text>
    <View style={[styles.profileCard, { backgroundColor: "#064E4A" }]}><View style={styles.profileCircle}><Text style={styles.profileLetter}>S</Text></View><View><Text style={styles.profileLabel}>Warga Sulawesi Tenggara</Text><Text style={styles.profileHint}>Belum masuk</Text></View></View>
    <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Verifikasi identitas</Text>
    <View style={styles.channelRow}>{(["email", "whatsapp"] as const).map((item) => <Pressable key={item} onPress={() => { setChannel(item); setCode(""); setRequested(false); }} style={[styles.channel, { backgroundColor: channel === item ? colors.primary : colors.surface, borderColor: channel === item ? colors.primary : colors.border }]}><Text style={{ color: channel === item ? "#FFFFFF" : colors.muted, fontWeight: "800" }}>{item === "email" ? "Email" : "WhatsApp"}</Text></Pressable>)}</View>
    <TextInput value={destination} onChangeText={setDestination} keyboardType={channel === "email" ? "email-address" : "phone-pad"} autoCapitalize="none" placeholder={channel === "email" ? "nama@email.com" : "08xxxxxxxxxx"} placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]} />
    {requested && <TextInput value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} placeholder="Masukkan 6 digit OTP" placeholderTextColor={colors.muted} style={[styles.input, { color: colors.foreground, backgroundColor: colors.surface, borderColor: colors.border }]} />}
    <Pressable disabled={busy || !destination || (requested && code.length !== 6)} onPress={submit} style={({ pressed }) => [styles.button, { backgroundColor: colors.primary, opacity: busy || !destination ? 0.55 : pressed ? 0.82 : 1 }]}><Text style={styles.buttonText}>{busy ? "Memproses..." : requested ? "Verifikasi OTP" : "Kirim kode OTP"}</Text></Pressable>
    <Text style={[styles.message, { color: colors.muted }]}>{message}</Text>
  </View></ScreenContainer>;
}

const styles = StyleSheet.create({ content: { paddingTop: 18 }, kicker: { fontSize: 12, letterSpacing: 1.8, fontWeight: "800" }, title: { fontSize: 32, lineHeight: 38, fontWeight: "800", marginTop: 8 }, subtitle: { fontSize: 15, lineHeight: 22, marginTop: 10 }, profileCard: { borderRadius: 22, padding: 18, marginTop: 26, flexDirection: "row", alignItems: "center", gap: 14 }, profileCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#E87561", alignItems: "center", justifyContent: "center" }, profileLetter: { color: "#FFFFFF", fontSize: 20, fontWeight: "800" }, profileLabel: { color: "#FFFFFF", fontSize: 15, fontWeight: "800" }, profileHint: { color: "#B9DFD4", fontSize: 13, marginTop: 3 }, sectionTitle: { fontSize: 19, fontWeight: "800", marginTop: 30, marginBottom: 12 }, channelRow: { flexDirection: "row", gap: 10 }, channel: { flex: 1, paddingVertical: 13, borderRadius: 13, borderWidth: 1, alignItems: "center" }, input: { height: 54, borderWidth: 1, borderRadius: 15, paddingHorizontal: 16, fontSize: 16, marginTop: 12 }, button: { borderRadius: 15, alignItems: "center", paddingVertical: 16, marginTop: 16 }, buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" }, message: { textAlign: "center", lineHeight: 19, marginTop: 14 } });
