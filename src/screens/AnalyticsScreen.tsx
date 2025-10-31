// src/screens/AnalyticsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../config/supabase";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

type AnalyticsTotals = {
  total_views: number;
  unique_sessions: number;
  avg_dwell_seconds: number;
};

type AnalyticsData = {
  totals: AnalyticsTotals | null;
  views_per_day: { date: string; views: number }[];
  interactions_by_type: { type: string; count: number }[];
  top_links: { label: string; url: string | null; clicks: number }[];
};

type CardRow = { id: string; full_name: string | null; slug: string };

export default function AnalyticsScreen() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [cards, setCards] = useState<CardRow[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const barColors = [
    "#0066FF",
    "#FF9500",
    "#34C759",
    "#FF2D55",
    "#5856D6",
    "#AF52DE",
    "#FFCC00",
    "#0A84FF",
  ];

  async function getMyUserId(): Promise<string | null> {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id ?? null;
  }

  const fetchCards = async () => {
    const uid = await getMyUserId();
    if (!uid) {
      setCards([]);
      setSelectedCard(null);
      return;
    }

    const { data, error } = await supabase
      .from("cards")
      .select("id, full_name, slug")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setCards(data);
      if (data.length > 0 && !selectedCard) setSelectedCard(data[0].id);
      if (data.length === 0) setSelectedCard(null);
    } else {
      setCards([]);
      setSelectedCard(null);
    }
  };

  const fetchAnalytics = async (cardId?: string) => {
    try {
      const fn = cardId ? "dashboard_analytics_card" : "dashboard_analytics_overall";
      const params = cardId ? { p_card_id: cardId, p_days: 7 } : { p_days: 7 };
      const { data, error } = await supabase.rpc(fn, params);

      if (error) {
        if ((error as any).code === "P0001") {
          setSelectedCard(null);
          const { data: overall, error: overallErr } = await supabase.rpc(
            "dashboard_analytics_overall",
            { p_days: 7 }
          );
          if (overallErr) throw overallErr;
          setData(overall as AnalyticsData);
          return;
        }
        throw error;
      }

      setData(
        (data as AnalyticsData) ?? {
          totals: { total_views: 0, unique_sessions: 0, avg_dwell_seconds: 0 },
          views_per_day: [],
          interactions_by_type: [],
          top_links: [],
        }
      );
    } catch (e) {
      console.error("Analytics fetch error:", e);
      setData({
        totals: { total_views: 0, unique_sessions: 0, avg_dwell_seconds: 0 },
        views_per_day: [],
        interactions_by_type: [],
        top_links: [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchCards();
      setTimeout(() => {
        if (!selectedCard) fetchAnalytics();
      }, 0);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedCard) fetchAnalytics(selectedCard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCard]);

  const totals = {
    total_views: data?.totals?.total_views ?? 0,
    unique_sessions: data?.totals?.unique_sessions ?? 0,
    avg_dwell_seconds: data?.totals?.avg_dwell_seconds ?? 0,
  };

  const safeViews = Array.isArray(data?.views_per_day) ? data!.views_per_day : [];
  const safeInteractions = Array.isArray(data?.interactions_by_type)
    ? data!.interactions_by_type
    : [];
  const safeTopLinks = Array.isArray(data?.top_links) ? data!.top_links : [];

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnalytics(selectedCard ?? undefined);
  };

  if (loading && !data) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#0066FF" />
        <Text style={{ marginTop: 8 }}>Loading analytics…</Text>
      </View>
    );
  }

  const maxInteraction = safeInteractions.reduce(
    (m, s) => Math.max(m, Number(s.count) || 0),
    0
  );
  const barMaxWidth = screenWidth - 40 - 90;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F7F7F7" }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Card selector (only if > 1 owned card) */}
      {cards.length > 1 && (
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontWeight: "600", marginBottom: 6 }}>Select Card</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {cards.map((c) => {
              const active = selectedCard === c.id;
              return (
                <Text
                  key={c.id}
                  onPress={() => setSelectedCard(c.id)}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    marginRight: 8,
                    borderRadius: 20,
                    backgroundColor: active ? "#0066FF" : "#E5E7EB",
                    color: active ? "#fff" : "#333",
                  }}
                >
                  {c.full_name || c.slug}
                </Text>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* KPI Cards */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
        <View style={{ flex: 1, backgroundColor: "#fff", padding: 12, borderRadius: 12, marginRight: 8 }}>
          <Text style={{ fontSize: 13, color: "#777" }}>Total Views</Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#0066FF" }}>
            {totals.total_views}
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "#fff", padding: 12, borderRadius: 12, marginRight: 8 }}>
          <Text style={{ fontSize: 13, color: "#777" }}>Unique Visitors</Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#0066FF" }}>
            {totals.unique_sessions}
          </Text>
        </View>
        <View style={{ flex: 1, backgroundColor: "#fff", padding: 12, borderRadius: 12 }}>
          <Text style={{ fontSize: 13, color: "#777" }}>Avg Time (s)</Text>
          <Text style={{ fontSize: 22, fontWeight: "bold", color: "#0066FF" }}>
            {totals.avg_dwell_seconds}
          </Text>
        </View>
      </View>

      {/* Views per day (last 7 days) */}
      <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
          Views (Last 7 Days)
        </Text>
        {safeViews.length > 0 ? (
          <LineChart
            data={{
              labels: safeViews.map((d) => {
                try {
                  const dt = new Date(d.date);
                  const mm = String(dt.getMonth() + 1).padStart(2, "0");
                  const dd = String(dt.getDate()).padStart(2, "0");
                  return `${mm}/${dd}`;
                } catch {
                  return d.date;
                }
              }),
              datasets: [{ data: safeViews.map((d) => Number(d.views) || 0) }],
            }}
            width={screenWidth - 40}
            height={220}
            yAxisLabel=""
            chartConfig={{
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: () => "#0066FF",
              labelColor: () => "#555",
              propsForDots: { r: "4", strokeWidth: "2", stroke: "#0066FF" },
              decimalPlaces: 0,
            }}
            bezier
            style={{ borderRadius: 8 }}
          />
        ) : (
          <Text style={{ color: "#666" }}>No view data</Text>
        )}
      </View>

      {/* Interactions by type — stable horizontal bars */}
      <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
          Interactions by Type
        </Text>
        {safeInteractions.length > 0 && maxInteraction > 0 ? (
          safeInteractions.map((item, idx) => {
            const count = Number(item.count) || 0;
            const width =
              maxInteraction > 0
                ? Math.max(6, Math.round((count / maxInteraction) * barMaxWidth))
                : 6;
            const color = barColors[idx % barColors.length];
            return (
              <View
                key={`${item.type}-${idx}`}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={{ width: 90 }}>{item.type}</Text>
                <View
                  style={{
                    height: 16,
                    width,
                    backgroundColor: color,
                    borderRadius: 8,
                  }}
                />
                <Text style={{ marginLeft: 8, width: 40, textAlign: "right" }}>
                  {count}
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={{ color: "#666" }}>No interactions yet</Text>
        )}
      </View>

      {/* Top links */}
      <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>Top Links</Text>
        {safeTopLinks.length > 0 ? (
          safeTopLinks.map((t, i) => (
            <View
              key={`${t.label}-${i}`}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomWidth: i === safeTopLinks.length - 1 ? 0 : 0.5,
                borderColor: "#eee",
                paddingVertical: 6,
              }}
            >
              <Text numberOfLines={1} style={{ flex: 1 }}>
                {t.label || "Unknown"}
              </Text>
              <Text style={{ color: "#0066FF", fontWeight: "600" }}>{t.clicks}</Text>
            </View>
          ))
        ) : (
          <Text style={{ color: "#666" }}>No link clicks yet</Text>
        )}
      </View>
    </ScrollView>
  );
}
