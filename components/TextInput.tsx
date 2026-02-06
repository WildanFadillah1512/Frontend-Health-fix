import { View, TextInput as RNTextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { useState } from 'react';
import { PRIMARY } from '@/constants/Colors';

interface CustomTextInputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export default function TextInput({ label, error, icon, ...props }: CustomTextInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[
                styles.inputContainer,
                isFocused && styles.inputContainerFocused,
                error && styles.inputContainerError,
            ]}>
                {icon && <View style={styles.icon}>{icon}</View>}
                <RNTextInput
                    style={styles.input}
                    placeholderTextColor="rgba(255, 255, 255, 0.3)"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 9999,
        paddingHorizontal: 20,
        minHeight: 56,
    },
    inputContainerFocused: {
        borderColor: PRIMARY,
        backgroundColor: 'rgba(13, 242, 108, 0.05)',
    },
    inputContainerError: {
        borderColor: '#ef4444',
    },
    icon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#FFFFFF',
    },
    errorText: {
        fontSize: 12,
        color: '#ef4444',
        marginTop: 4,
        marginLeft: 20,
    },
});
