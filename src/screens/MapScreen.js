import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Dimensions, Animated, ScrollView, Platform
} from 'react-native';
import { theme } from '../styles/theme';
import { MATCH_TYPES, GAME_MODES, SKILL_LEVELS } from '../utils/constants';

const { width, height } = Dimensions.get('window');

// Fake matches near a location for testing
const FAKE_MATCHES = [
  {
    id: '1',
    type: '5v5',
    mode: 'ranked',
    skill: 'competitive',
    hostName: 'Carlos M.',
    players: 6,
    maxPlayers: 10,
    distance: '0.3 mi',
    timeLeft: '15 min',
    lat: 37.7849,
    lng: -122.4094,
    field: 'Mission Dolores Park',
  },
  {
    id: '2',
    type: '3v3',
    mode: 'casual',
    skill: 'casual',
    hostName: 'Ahmed K.',
    players: 3,
    maxPlayers: 6,
    distance: '0.7 mi',
    timeLeft: '32 min',
    lat: 37.7799,
    lng: -122.4144,
    field: 'Dolores St Courts',
  },
  {
    id: '3',
    type: '1v1',
    mode: 'ranked',
    skill: 'semipro',
    hostName: 'James T.',
    players: 1,
    maxPlayers: 2,
    distance: '1.1 mi',
    timeLeft: '8 min',
    lat: 37.7899,
    lng: -122.4004,
    field: 'Civic Center Plaza',
  },
  {
    id: '4',
    type: '5v5',
    mode: 'urgent',
    skill: 'beginner',
    hostName: 'Sofia R.',
    players: 7,
    maxPlayers: 10,
    distance: '1.4 mi',
    timeLeft: '5 min',
    lat: 37.7749,
    lng: -122.4194,
    field: 'Upper Noe Rec Center',
  },
];

const getModeColor = (mode) => {
  switch (mode) {
    case 'ranked': return theme.colors.accent;
    case 'casual': return theme.colors.casual;
    case 'urgent': return theme.colors.danger;
    case 'practice': return theme.colors.primary;
    default: return theme.colors.primary;
  }
};

const getModeEmoji = (mode) => {
  switch (mode) {
    case 'ranked': return '🏆';
    case 'casual': return '⚽';
    case 'urgent': return '🚨';
    case 'practice': return '🎯';
    default: return '⚽';
  }
};

const getSkillColor = (skill) => {
  const found = SKILL_LEVELS.find(s => s.value === skill);
  return found ? found.color : theme.colors.primary;
};

export default function MapScreen({ navigation }) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [filter, setFilter] = useState('all');
  const [pulseAnim] = useState(FAKE_MATCHES.map(() => new Animated.Value(1)));
  const cardAnim = useRef(new Animated.Value(0)).current;
  const [location, setLocation] = useState(null);

  // Pulse animation for map pins
  useEffect(() => {
    const animations = pulseAnim.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1.3,
            duration: 1000 + i * 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000 + i * 200,
            useNativeDriver: true,
          }),
        ])
      )
    );
    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
  }, []);

  // Card slide up animation
  useEffect(() => {
    if (selectedMatch) {
      Animated.spring(cardAnim, {
        toValue: 1,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(cardAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedMatch]);

  const filteredMatches = FAKE_MATCHES.filter(m => {
    if (filter === 'all') return true;
    return m.mode === filter;
  });

  const filters = [
    { label: '🌍 All', value: 'all' },
    { label: '🏆 Ranked', value: 'ranked' },
    { label: '⚽ Casual', value: 'casual' },
    { label: '🚨 Urgent', value: 'urgent' },
  ];

  return (
    <View style={styles.container}>

      {/* ── Fake Map Background ── */}
      <View style={styles.mapBackground}>
        {/* Grid lines to simulate map */}
        {[...Array(10)].map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLineH, { top: `${i * 10}%` }]} />
        ))}
        {[...Array(10)].map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: `${i * 10}%` }]} />
        ))}

        {/* Road lines */}
        <View style={[styles.road, { top: '30%', width: '100%', height: 3 }]} />
        <View style={[styles.road, { top: '60%', width: '100%', height: 3 }]} />
        <View style={[styles.road, { left: '25%', width: 3, height: '100%' }]} />
        <View style={[styles.road, { left: '65%', width: 3, height: '100%' }]} />

        {/* Green zones (parks) */}
        <View style={[styles.park, { top: '20%', left: '10%', width: 80, height: 60 }]} />
        <View style={[styles.park, { top: '55%', left: '50%', width: 100, height: 70 }]} />
        <View style={[styles.park, { top: '10%', left: '60%', width: 60, height: 50 }]} />

        {/* Match Pins */}
        {filteredMatches.map((match, index) => (
          <TouchableOpacity
            key={match.id}
            style={[
              styles.pinContainer,
              {
                top: `${20 + index * 18}%`,
                left: `${15 + index * 20}%`,
              },
            ]}
            onPress={() => setSelectedMatch(match)}
          >
            <Animated.View
              style={[
                styles.pinPulse,
                {
                  backgroundColor: getModeColor(match.mode),
                  transform: [{ scale: pulseAnim[index] }],
                },
              ]}
            />
            <View
              style={[
                styles.pin,
                {
                  backgroundColor: getModeColor(match.mode),
                  borderColor: selectedMatch?.id === match.id ? '#fff' : 'transparent',
                  borderWidth: selectedMatch?.id === match.id ? 2 : 0,
                },
              ]}
            >
              <Text style={styles.pinEmoji}>{getModeEmoji(match.mode)}</Text>
            </View>
            <View style={[styles.pinLabel, { backgroundColor: getModeColor(match.mode) }]}>
              <Text style={styles.pinLabelText}>{match.type}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* User location dot */}
        <View style={styles.userDotContainer}>
          <View style={styles.userDotOuter} />
          <View style={styles.userDot} />
        </View>
      </View>

      {/* ── Top Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>⚽ Go Soccer!</Text>
          <Text style={styles.headerSub}>4 matches near you</Text>
        </View>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileBtnText}>👤</Text>
        </TouchableOpacity>
      </View>

      {/* ── Filter Pills ── */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map(f => (
            <TouchableOpacity
              key={f.value}
              style={[
                styles.filterPill,
                filter === f.value && styles.filterPillActive,
              ]}
              onPress={() => setFilter(f.value)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f.value && styles.filterTextActive,
                ]}
              >
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── Match Count Banner ── */}
      <View style={styles.matchBanner}>
        <Text style={styles.matchBannerText}>
          🟢 {filteredMatches.length} active matches nearby
        </Text>
      </View>

      {/* ── Host Match Button ── */}
      <TouchableOpacity
        style={styles.hostBtn}
        onPress={() => navigation.navigate('HostMatch')}
      >
        <Text style={styles.hostBtnText}>+ Host Match</Text>
      </TouchableOpacity>

      {/* ── Selected Match Card ── */}
      {selectedMatch && (
        <Animated.View
          style={[
            styles.matchCard,
            {
              transform: [
                {
                  translateY: cardAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [300, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setSelectedMatch(null)}
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>

          {/* Mode badge */}
          <View style={[styles.modeBadge, { backgroundColor: getModeColor(selectedMatch.mode) }]}>
            <Text style={styles.modeBadgeText}>
              {getModeEmoji(selectedMatch.mode)} {selectedMatch.mode.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.cardField}>{selectedMatch.field}</Text>
          <Text style={styles.cardHost}>Hosted by {selectedMatch.hostName}</Text>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{selectedMatch.type}</Text>
              <Text style={styles.statLabel}>Format</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>
                {selectedMatch.players}/{selectedMatch.maxPlayers}
              </Text>
              <Text style={styles.statLabel}>Players</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{selectedMatch.distance}</Text>
              <Text style={styles.statLabel}>Away</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: theme.colors.danger }]}>
                {selectedMatch.timeLeft}
              </Text>
              <Text style={styles.statLabel}>Starts in</Text>
            </View>
          </View>

          {/* Skill level */}
          <View style={styles.skillRow}>
            <Text style={styles.skillLabel}>Skill level: </Text>
            <View style={[styles.skillBadge, { backgroundColor: getSkillColor(selectedMatch.skill) + '33' }]}>
              <Text style={[styles.skillText, { color: getSkillColor(selectedMatch.skill) }]}>
                {selectedMatch.skill.charAt(0).toUpperCase() + selectedMatch.skill.slice(1)}
              </Text>
            </View>
          </View>

          {/* Players bar */}
          <View style={styles.playersBarBg}>
            <View
              style={[
                styles.playersBarFill,
                {
                  width: `${(selectedMatch.players / selectedMatch.maxPlayers) * 100}%`,
                  backgroundColor: getModeColor(selectedMatch.mode),
                },
              ]}
            />
          </View>
          <Text style={styles.playersBarLabel}>
            {selectedMatch.maxPlayers - selectedMatch.players} spots left
          </Text>

          {/* Join button */}
          <TouchableOpacity style={styles.joinBtn}>
            <Text style={styles.joinBtnText}>⚡ Join Match</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.mapBackground,
  },
  mapBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#1A1A2E',
    overflow: 'hidden',
  },
  gridLineH: {
    position: 'absolute',
    left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  road: {
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  park: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 200, 83, 0.08)',
    borderRadius: 8,
  },
  pinContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinPulse: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    opacity: 0.2,
    top: -10,
    left: -10,
  },
  pin: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  pinEmoji: {
    fontSize: 20,
  },
  pinLabel: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  pinLabelText: {
    color: '#000',
    fontSize: 10,
    fontWeight: '800',
  },
  userDotContainer: {
    position: 'absolute',
    top: '48%',
    left: '48%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDotOuter: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(66, 133, 244, 0.3)',
  },
  userDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4285F4',
    borderWidth: 2,
    borderColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(10,10,10,0.85)',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  headerSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  profileBtnText: {
    fontSize: 18,
  },
  filterContainer: {
    position: 'absolute',
    top: 110,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(26,26,26,0.9)',
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterPillActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#000',
  },
  matchBanner: {
    position: 'absolute',
    top: 158,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,200,83,0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,200,83,0.3)',
  },
  matchBannerText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  hostBtn: {
    position: 'absolute',
    bottom: 32,
    alignSelf: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  hostBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  matchCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  modeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  modeBadgeText: {
    color: '#000',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardField: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardHost: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: theme.borderRadius.md,
    padding: 16,
    marginBottom: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
    marginHorizontal: 4,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  skillLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  skillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  playersBarBg: {
    height: 6,
    backgroundColor: theme.colors.surfaceLight,
    borderRadius: 999,
    marginBottom: 6,
    overflow: 'hidden',
  },
  playersBarFill: {
    height: '100%',
    borderRadius: 999,
  },
  playersBarLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 16,
  },
  joinBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  joinBtnText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '900',
  },
});