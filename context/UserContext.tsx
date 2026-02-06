import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import client from '../api/client';
import { DatabaseService } from '../services/DatabaseService';
import { NotificationService } from '../services/NotificationService';

export type Meal = {
    id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    time: string;
    image?: string;
};

export type CompletedWorkout = {
    id: string;
    workoutId: number;
    date: string;
    duration: number; // in seconds
    calories: number;
};

type UserData = {
    name: string;
    avatar?: string;
    weight: number;
    height: number;
    age: number;
    gender: 'male' | 'female' | 'other';
    goal: string;
    activityLevel: string;
    targetWeight: number;
    initialWeight?: number; // Added for progress tracking
    hasOnboarded: boolean;
    currentStreak?: number; // Added for gamification
    level?: number;         // Added for gamification
    completedWorkouts: CompletedWorkout[];
    notifications: any[]; // Added for real notifications
    achievements: any[]; // Added for gamification
    preferences: {
        weightUnit: 'kg' | 'lbs';
        heightUnit: 'cm' | 'ft';
        workoutReminder: boolean;
        reminderTime: string | null;
        dailyGoalAlert: boolean;
        theme: 'dark' | 'light';
        calorieGoal: number; // Added for calorie tracking
    };
    dailyStats: {
        calories: number;
        minutes: number;
        workouts: number;
        water: number; // ml
        sleep: number; // hours
        meals: Meal[];
    };
};

type UserContextType = {
    userData: UserData;
    updateUserData: (data: Partial<UserData>) => void;
    completeWorkout: (workoutId: number, duration: number, calories: number) => void;
    addWater: (amount: number) => void;
    logSleep: (data: { sleepTime: string; wakeTime: string; quality: string; notes?: string }) => void;
    addMeal: (meal: Meal) => void;
    updatePreferences: (prefs: Partial<UserData['preferences']>) => void;
};

const defaultUserData: UserData = {
    name: '',
    weight: 0,
    height: 0,
    age: 0,
    gender: 'male',
    goal: 'lose_weight',
    activityLevel: 'moderate',
    targetWeight: 0,
    hasOnboarded: false,
    currentStreak: 0,
    level: 1,
    completedWorkouts: [],
    notifications: [], // Default empty
    achievements: [],
    preferences: {
        weightUnit: 'kg',
        heightUnit: 'cm',
        workoutReminder: false,
        reminderTime: null,
        dailyGoalAlert: true,
        theme: 'dark',
        calorieGoal: 2000
    },
    dailyStats: {
        calories: 0,
        minutes: 0,
        workouts: 0,
        water: 0,
        sleep: 0,
        meals: [],
    },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserData>(defaultUserData);

    // Initialize DB on mount
    useEffect(() => {
        try {
            DatabaseService.init();
            console.log('✅ SQLite Database initialized');
        } catch (e) {
            console.error("❌ Failed to init DB", e);
        }
    }, []);

    // Fetch notifications from backend
    const fetchNotifications = async () => {
        try {
            const response = await client.get('/notifications');
            setUserData(prev => ({ ...prev, notifications: response.data || [] }));
            console.log('✅ Notifications loaded:', response.data?.length || 0);
        } catch (error) {
            console.error('❌ Failed to fetch notifications:', error);
        }
    };

    // Load from SQLite on auth change or startup
    useEffect(() => {
        if (user) {
            loadFromSQLite(user.uid);
            fetchUserData();
            fetchNotifications(); // Fetch notifications on login
            // Register Push Token (Stub)
            NotificationService.registerForPushNotificationsAsync().catch(console.error);
        } else {
            setUserData(defaultUserData);
        }
    }, [user]);

    const loadFromSQLite = (uid: string) => {
        try {
            const localUser = DatabaseService.getUser(uid);
            const localStats = DatabaseService.getDailyStats(uid);
            const localPrefs = DatabaseService.getPreferences(uid);

            if (localUser) {
                console.log("✅ Loaded user from SQLite:", localUser.name, "| Onboarded:", !!localUser.hasOnboarded);

                // Merge local stats if valid
                const dailyStats = localStats ? {
                    calories: localStats.calories,
                    minutes: localStats.minutes,
                    workouts: localStats.workouts,
                    water: localStats.water,
                    sleep: localStats.sleep,
                    meals: [] // Meals loaded separately if needed, or by Today screen
                } : defaultUserData.dailyStats;

                setUserData(prev => ({
                    ...prev,
                    name: localUser.name,
                    weight: localUser.weight,
                    height: localUser.height,
                    age: localUser.age,
                    gender: localUser.gender as 'male' | 'female' | 'other',
                    goal: localUser.goal,
                    activityLevel: localUser.activityLevel,
                    targetWeight: localUser.targetWeight,
                    initialWeight: localUser.initialWeight, // Added
                    hasOnboarded: localUser.hasOnboarded === 1,
                    dailyStats: {
                        ...dailyStats,
                        meals: [] // Will be populated by specific meal fetch if needed
                    },
                    achievements: DatabaseService.getAchievements(uid) || [], // Load achievements
                    preferences: localPrefs ? {
                        weightUnit: localPrefs.weightUnit as 'kg' | 'lbs',
                        heightUnit: localPrefs.heightUnit as 'cm' | 'ft',
                        workoutReminder: localPrefs.workoutReminder === 1,
                        reminderTime: localPrefs.reminderTime,
                        dailyGoalAlert: localPrefs.dailyGoalAlert === 1,
                        theme: localPrefs.theme as 'dark' | 'light',
                        calorieGoal: localPrefs.calorieGoal
                    } : prev.preferences
                }));
            } else {
                console.log("ℹ️ No local user data found in SQLite");
            }
        } catch (e) {
            console.error("❌ SQLite load error:", e);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await client.get('/user/profile');
            // Handle new users who don't have a profile yet (null response)
            if (response.data && response.data !== null) {
                const profile = response.data;
                // Ensure daily stats structure exists
                if (!profile.dailyStats) {
                    profile.dailyStats = defaultUserData.dailyStats;
                }

                // Fetch full achievements list separately to ensure we have all of them, not just 5 from profile
                try {
                    const achResponse = await client.get('/achievements');
                    if (achResponse.data) {
                        profile.achievements = achResponse.data;
                    }
                } catch (e) {
                    console.log('Failed to fetch achievements', e);
                }

                setUserData(prev => {
                    const newData = { ...prev, ...profile };

                    // Sync to SQLite
                    if (user) {
                        try {
                            DatabaseService.saveUser({
                                uid: user.uid,
                                email: user.email || '',
                                name: newData.name,
                                hasOnboarded: newData.hasOnboarded ? 1 : 0,
                                weight: newData.weight,
                                height: newData.height,
                                age: newData.age,
                                gender: newData.gender,
                                goal: newData.goal,
                                activityLevel: newData.activityLevel,
                                targetWeight: newData.targetWeight,
                                initialWeight: newData.initialWeight // Sync initialWeight
                            });

                            // Sync Achievements
                            if (newData.achievements) {
                                DatabaseService.saveAchievements(newData.achievements);
                            }

                            console.log('✅ User profile & achievements synced to SQLite');
                        } catch (e) {
                            console.error("❌ Failed to save to SQLite:", e);
                        }
                    }
                    return newData;
                });
            } else {
                // New user - profile will be created after onboarding
                console.log('ℹ️ New user detected - profile will be created after onboarding');
            }
        } catch (error) {
            console.log('Profile fetch error (this is normal for new users):', error);
        }
    };

    const updateUserData = async (data: Partial<UserData>) => {
        // Optimistic update
        setUserData((prev) => {
            const newData = { ...prev, ...data };

            // Sync to SQLite
            if (user) {
                try {
                    DatabaseService.saveUser({
                        uid: user.uid,
                        email: user.email || '',
                        name: newData.name,
                        hasOnboarded: newData.hasOnboarded ? 1 : 0,
                        weight: newData.weight,
                        height: newData.height,
                        age: newData.age,
                        gender: newData.gender,
                        goal: newData.goal,
                        activityLevel: newData.activityLevel,
                        targetWeight: newData.targetWeight,
                        initialWeight: newData.initialWeight
                    });
                    console.log('✅ User data updated in SQLite');
                } catch (e) {
                    console.error("❌ Failed to update SQLite:", e);
                }
            }
            return newData;
        });

        // Sync to backend
        try {
            // Set initialWeight = weight if this is first time (initialWeight not set yet)
            const syncData: any = {
                ...userData,
                ...data
            };

            // On first onboarding (hasOnboarded becomes true), set initialWeight
            if (data.hasOnboarded && !userData.initialWeight) {
                syncData.initialWeight = userData.weight;
                console.log('\u2705 Setting initialWeight to', userData.weight);
            }

            await client.post('/user/sync', syncData);
            console.log('\u2705 User data synced to backend', syncData);
        } catch (error) {
            console.error('Failed to sync user data to backend:', error);
        }
    };

    const completeWorkout = async (workoutId: number, duration: number, calories: number) => {
        const workoutData = {
            id: Date.now().toString(),
            workoutId,
            date: new Date().toISOString(),
            duration,
            calories,
        };

        // Optimistic update
        setUserData((prev) => ({
            ...prev,
            completedWorkouts: [...prev.completedWorkouts, workoutData],
            dailyStats: {
                ...prev.dailyStats,
                calories: prev.dailyStats.calories + calories,
                minutes: prev.dailyStats.minutes + Math.round(duration / 60),
                workouts: prev.dailyStats.workouts + 1,
            },
        }));

        // Save to SQLite for offline access
        if (user) {
            try {
                DatabaseService.saveCompletedWorkout(workoutData, user.uid);
                console.log('✅ Workout saved to SQLite');
            } catch (e) {
                console.error('Failed to save workout to SQLite:', e);
            }
        }

        // Backend Sync
        try {
            await client.post('/workouts/complete', {
                workoutId: workoutId.toString(),
                duration,
                calories
            });
        } catch (error) {
            console.error('Failed to sync workout:', error);
        }
    };

    const addWater = async (amount: number) => {
        const waterLog = {
            id: Date.now().toString(),
            amount,
            timestamp: new Date().toISOString()
        };

        // Optimistic Update
        const newWater = userData.dailyStats.water + amount;
        setUserData((prev) => {
            const newData = {
                ...prev,
                dailyStats: {
                    ...prev.dailyStats,
                    water: newWater,
                },
            };
            // Local Sync - Save individual log
            try {
                DatabaseService.saveDailyStats(user?.uid || 'guest', newData.dailyStats);
                DatabaseService.saveWaterLog(waterLog, user?.uid || 'guest');
                console.log('✅ Water log saved to SQLite');
            } catch (e) { console.error(e); }

            return newData;
        });

        // Backend Sync
        try {
            await client.post('/water', { amount });
        } catch (error) {
            console.error('Failed to sync water:', error);
        }
    };

    const logSleep = async (data: { sleepTime: string; wakeTime: string; quality: string; notes?: string }) => {
        // Calculate hours for optimistic update
        const start = new Date(data.sleepTime);
        const end = new Date(data.wakeTime);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

        const sleepLog = {
            id: Date.now().toString(),
            ...data
        };

        // Optimistic Update
        setUserData((prev) => {
            const newData = {
                ...prev,
                dailyStats: {
                    ...prev.dailyStats,
                    sleep: hours,
                },
            };
            // Local Sync - Save individual log
            try {
                DatabaseService.saveDailyStats(user?.uid || 'guest', newData.dailyStats);
                DatabaseService.saveSleepLog(sleepLog, user?.uid || 'guest');
                console.log('✅ Sleep log saved to SQLite');
            } catch (e) { console.error(e); }

            return newData;
        });

        // Backend Sync
        try {
            await client.post('/sleep', data);
        } catch (error) {
            console.error('Failed to sync sleep:', error);
        }
    };


    const updatePreferences = async (newPrefs: Partial<typeof defaultUserData.preferences>) => {
        // Optimistic Update
        setUserData((prev) => {
            const newData = {
                ...prev,
                preferences: { ...prev.preferences, ...newPrefs }
            };
            // Local Sync
            try {
                DatabaseService.savePreferences(user?.uid || 'guest', newData.preferences);
            } catch (e) { console.error("Pref Save Error", e); }
            return newData;
        });

        // Backend Sync
        try {
            await client.put('/user/preferences', newPrefs);
        } catch (e) {
            console.error("Failed to sync preferences", e);
        }
    };

    // --- PHASE 4A: SYNC METHODS FOR OFFLINE PARITY ---

    const syncAdminDataToSQLite = async () => {
        try {
            // Sync recipes
            const recipesResponse = await client.get('/recipes');
            if (recipesResponse.data) {
                DatabaseService.saveRecipes(recipesResponse.data);
                console.log(`✅ Synced ${recipesResponse.data.length} recipes to SQLite`);
            }
        } catch (e) {
            console.error('Failed to sync recipes:', e);
        }

        try {
            // Sync programs
            const programsResponse = await client.get('/programs');
            if (programsResponse.data) {
                DatabaseService.savePrograms(programsResponse.data);
                console.log(`✅ Synced ${programsResponse.data.length} programs to SQLite`);

                // Sync program workouts for each program
                for (const program of programsResponse.data) {
                    if (program.workouts) {
                        DatabaseService.saveProgramWorkouts(program.workouts);
                    }
                }
            }
        } catch (e) {
            console.error('Failed to sync programs:', e);
        }

        try {
            // Sync achievement definitions
            const achievementsResponse = await client.get('/achievements/definitions');
            if (achievementsResponse.data) {
                DatabaseService.saveAchievementDefinitions(achievementsResponse.data);
                console.log(`✅ Synced ${achievementsResponse.data.length} achievement definitions to SQLite`);
            }
        } catch (e) {
            console.error('Failed to sync achievement definitions:', e);
        }

        try {
            // Sync exercises (from all workouts)
            const workoutsResponse = await client.get('/workouts');
            if (workoutsResponse.data) {
                const allExercises: any[] = [];
                for (const workout of workoutsResponse.data) {
                    if (workout.exercises) {
                        allExercises.push(...workout.exercises);
                    }
                }
                if (allExercises.length > 0) {
                    DatabaseService.saveExercises(allExercises);
                    console.log(`✅ Synced ${allExercises.length} exercises to SQLite`);
                }
            }
        } catch (e) {
            console.error('Failed to sync exercises:', e);
        }
    };

    const syncUserDataToSQLite = async () => {
        if (!user) return;

        try {
            // Sync completed workouts
            const completedResponse = await client.get('/workouts/history');
            if (completedResponse.data) {
                for (const workout of completedResponse.data) {
                    DatabaseService.saveCompletedWorkout(workout, user.uid);
                }
                console.log(`✅ Synced ${completedResponse.data.length} completed workouts to SQLite`);
            }
        } catch (e) {
            console.error('Failed to sync completed workouts:', e);
        }

        try {
            // Sync body measurements
            const measurementsResponse = await client.get('/measurements');
            if (measurementsResponse.data) {
                for (const measurement of measurementsResponse.data) {
                    DatabaseService.saveBodyMeasurement(measurement, user.uid);
                }
                console.log(`✅ Synced ${measurementsResponse.data.length} measurements to SQLite`);
            }
        } catch (e) {
            console.error('Failed to sync measurements:', e);
        }

        try {
            // Sync water logs (last 30 days)
            const waterResponse = await client.get('/water/logs');
            if (waterResponse.data) {
                for (const log of waterResponse.data) {
                    DatabaseService.saveWaterLog(log, user.uid);
                }
                console.log(`✅ Synced ${waterResponse.data.length} water logs to SQLite`);
            }
        } catch (e) {
            console.error('Failed to sync water logs:', e);
        }

        try {
            // Sync sleep logs (last 30 days)
            const sleepResponse = await client.get('/sleep/logs');
            if (sleepResponse.data) {
                for (const log of sleepResponse.data) {
                    DatabaseService.saveSleepLog(log, user.uid);
                }
                console.log(`✅ Synced ${sleepResponse.data.length} sleep logs to SQLite`);
            }
        } catch (e) {
            console.error('Failed to sync sleep logs:', e);
        }
    };

    // Call sync on user login
    useEffect(() => {
        if (user) {
            syncAdminDataToSQLite();
            syncUserDataToSQLite();
        }
    }, [user?.uid]); // Only run when user changes

    const addMeal = async (meal: Meal) => {
        // Optimistic Update
        setUserData((prev) => ({
            ...prev,
            dailyStats: {
                ...prev.dailyStats,
                meals: [...prev.dailyStats.meals, meal],
                calories: prev.dailyStats.calories + meal.calories,
            },
        }));

        // Local SQLite Sync (Offline support)
        try {
            DatabaseService.saveMeal({
                ...meal,
                userId: user?.uid || 'guest'
            });
            console.log('✅ Meal saved to SQLite');
        } catch (e) {
            console.error('❌ Failed to save meal to SQLite:', e);
        }

        // Backend Sync
        try {
            await client.post('/meals', {
                ...meal,
                time: new Date().toISOString()
            });
        } catch (error) {
            console.error('Failed to sync meal:', error);
        }
    };

    return (
        <UserContext.Provider value={{
            userData,
            updateUserData,
            completeWorkout,
            addWater,
            logSleep,
            addMeal,
            updatePreferences
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
