import { Pressable, Text, StyleSheet, View, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { PRIMARY } from '@/constants/Colors';

interface ButtonProps {
    onPress: () => void;
    title: string;
    variant?: 'primary' | 'secondary' | 'outline';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export default function Button({
    onPress,
    title,
    variant = 'primary',
    disabled = false,
    loading = false,
    icon,
    style,
    textStyle,
}: ButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={({ pressed }) => [
                styles.button,
                variant === 'primary' && styles.primaryButton,
                variant === 'secondary' && styles.secondaryButton,
                variant === 'outline' && styles.outlineButton,
                pressed && styles.pressed,
                (disabled || loading) && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? '#000' : PRIMARY} />
            ) : (
                <View style={styles.content}>
                    {icon}
                    <Text
                        style={[
                            styles.text,
                            variant === 'primary' && styles.primaryText,
                            variant === 'secondary' && styles.secondaryText,
                            variant === 'outline' && styles.outlineText,
                            textStyle,
                        ]}
                    >
                        {title}
                    </Text>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 9999,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    primaryButton: {
        backgroundColor: PRIMARY,
        shadowColor: PRIMARY,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    secondaryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: PRIMARY,
    },
    pressed: {
        transform: [{ scale: 0.98 }],
    },
    disabled: {
        opacity: 0.5,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    primaryText: {
        color: '#000000',
    },
    secondaryText: {
        color: '#FFFFFF',
    },
    outlineText: {
        color: PRIMARY,
    },
});
