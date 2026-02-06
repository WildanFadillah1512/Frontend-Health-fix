import { useState, useEffect } from 'react';
import { DatabaseService } from '../services/DatabaseService';
import { WORKOUTS } from '../data/workouts';
import type { Workout } from '../data/workouts';
import client from '../api/client';

export function useWorkouts() {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadWorkouts();
    }, []);

    const loadWorkouts = async () => {
        setIsLoading(true);
        try {
            // 1. Try to load from SQLite (Fast)
            const cachedWorkouts = DatabaseService.getAllWorkouts();
            if (cachedWorkouts.length > 0) {
                console.log(`✅ Loaded ${cachedWorkouts.length} workouts from SQLite`);
                setWorkouts(cachedWorkouts);
                setIsLoading(false); // Show data immediately
            }

            // 2. Fetch from Backend (Sync)
            console.log('🔄 Syncing workouts from Supabase...');
            const response = await client.get('/workouts');

            if (response.data && Array.isArray(response.data)) {
                const serverWorkouts = response.data;
                console.log(`✅ Fetched ${serverWorkouts.length} workouts from API`);

                // Update SQLite with fresh data
                DatabaseService.saveWorkouts(serverWorkouts);
                setWorkouts(serverWorkouts);
            }
        } catch (error) {
            console.error('❌ Failed to sync workouts:', error);
            // If no local data and sync failed, falling back to static (if critical) 
            // but we rely on SQLite being seeded or valid.
            if (workouts.length === 0) {
                setWorkouts(WORKOUTS); // Fallback to hardcoded if absolute fail
            }
        } finally {
            setIsLoading(false);
        }
    };

    const refreshWorkouts = () => {
        loadWorkouts();
    };

    return {
        workouts,
        isLoading,
        refreshWorkouts,
    };
}
