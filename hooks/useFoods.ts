import { useState, useEffect } from 'react';
import { DatabaseService } from '../services/DatabaseService';
import { FOODS } from '../data/foods';
import client from '../api/client';

export function useFoods() {
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        seedFoods();
    }, []);

    const seedFoods = async () => {
        try {
            // 1. Check Local SQLite
            const cachedFoods = DatabaseService.getAllFoods();
            if (cachedFoods.length > 0) {
                console.log(`✅ Loaded ${cachedFoods.length} foods from SQLite`);
            }

            // 2. Fetch System Foods from Backend
            // We only need to do this occasionally or on mount
            const response = await client.get('/foods');
            if (response.data && Array.isArray(response.data)) {
                const serverFoods = response.data;
                console.log(`✅ Syncing ${serverFoods.length} foods from API`);
                DatabaseService.seedFoods(serverFoods);
            }
        } catch (error) {
            console.error('❌ Failed to sync foods:', error);
            // Fallback to hardcoded if DB is empty
            const cached = DatabaseService.getAllFoods();
            if (cached.length === 0) {
                DatabaseService.seedFoods(FOODS);
            }
        }
    };

    const searchFoods = (query: string) => {
        if (!query) {
            setSearchResults([]);
            return;
        }
        setIsLoading(true);
        try {
            const results = DatabaseService.searchFoods(query);
            setSearchResults(results);
        } catch (e) {
            console.error(e);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        searchResults,
        searchFoods,
        isLoading
    };
}
