import { View, ViewStyle, StyleProp } from 'react-native';
import { StyleSheet } from 'react-native';

interface GlassPanelProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

export default function GlassPanel({ children, style }: GlassPanelProps) {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
        padding: 16,
    },
});
