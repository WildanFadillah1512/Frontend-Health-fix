// Placeholder implementation - will be replaced with react-native-svg when dependencies are resolved
import { View, Text, StyleSheet } from 'react-native';

interface CircularProgressProps {
    size: number;
    strokeWidth: number;
    progress: number;
    color?: string;
    children?: React.ReactNode;
}

// Simple fallback without SVG - will show as colored boxes for now
export default function CircularProgress({
    size,
    progress,
    color = '#0df26c',
    children,
}: CircularProgressProps) {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <View style={[styles.progressIndicator, { borderColor: color, opacity: progress }]} />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 8,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 9999,
    },
    progressIndicator: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderWidth: 8,
        borderRadius: 9999,
    },
});
