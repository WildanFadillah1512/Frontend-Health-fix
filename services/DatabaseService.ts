
import * as SQLite from 'expo-sqlite';
import { Meal, CompletedWorkout } from '@/context/UserContext';
import { Workout } from '@/data/workouts';

const db = SQLite.openDatabaseSync('healthfit.db');

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    hasOnboarded: number; // 0 or 1
    weight: number;
    height: number;
    age: number;
    gender: string;
    goal: string;
    activityLevel: string;
    targetWeight: number;
    initialWeight?: number; // Added
}

export const DatabaseService = {
    init: () => {
        db.execSync(`
            PRAGMA journal_mode = WAL;
            
            -- Users
            CREATE TABLE IF NOT EXISTS users (
                uid TEXT PRIMARY KEY NOT NULL,
                name TEXT,
                email TEXT,
                hasOnboarded INTEGER DEFAULT 0,
                weight REAL,
                height REAL,
                age INTEGER,
                gender TEXT,
                goal TEXT,
                activityLevel TEXT,
                targetWeight REAL,
                initialWeight REAL
            );

            -- Meals
            CREATE TABLE IF NOT EXISTS meals (
                id TEXT PRIMARY KEY,
                userId TEXT,
                name TEXT,
                calories INTEGER,
                protein REAL,
                carbs REAL,
                fat REAL,
                time TEXT,
                image TEXT,
                synced INTEGER DEFAULT 0
            );

            -- Foods
            CREATE TABLE IF NOT EXISTS foods (
                id TEXT PRIMARY KEY,
                name TEXT,
                calories INTEGER,
                protein REAL,
                carbs REAL,
                fat REAL,
                image TEXT
            );

            -- Workouts
            CREATE TABLE IF NOT EXISTS workouts (
                id TEXT PRIMARY KEY NOT NULL,
                title TEXT,
                description TEXT,
                category TEXT,
                difficulty TEXT,
                duration INTEGER,
                calories INTEGER,
                icon TEXT,
                json_data TEXT
            );

            -- Completed Workouts
            CREATE TABLE IF NOT EXISTS completed_workouts (
                id TEXT PRIMARY KEY NOT NULL,
                userId TEXT,
                workoutId TEXT,
                date TEXT,
                duration INTEGER,
                calories INTEGER,
                synced INTEGER DEFAULT 0
            );

            -- Chat
            CREATE TABLE IF NOT EXISTS chat_messages (
                id TEXT PRIMARY KEY NOT NULL,
                text TEXT,
                sender TEXT,
                timestamp TEXT,
                userId TEXT,
                synced INTEGER DEFAULT 0
            );

            -- Daily Stats
            CREATE TABLE IF NOT EXISTS daily_stats (
                userId TEXT NOT NULL,
                date TEXT NOT NULL,
                calories INTEGER DEFAULT 0,
                minutes INTEGER DEFAULT 0,
                workouts INTEGER DEFAULT 0,
                water INTEGER DEFAULT 0,
                sleep REAL DEFAULT 0,
                synced INTEGER DEFAULT 0,
                PRIMARY KEY (userId, date)
            );

            -- Preferences
            CREATE TABLE IF NOT EXISTS user_preferences (
                userId TEXT PRIMARY KEY NOT NULL,
                weightUnit TEXT DEFAULT 'kg',
                heightUnit TEXT DEFAULT 'cm',
                workoutReminder INTEGER DEFAULT 0, -- boolean
                reminderTime TEXT,
                dailyGoalAlert INTEGER DEFAULT 1, -- boolean
                theme TEXT DEFAULT 'dark',
                calorieGoal INTEGER DEFAULT 2000,
                synced INTEGER DEFAULT 0
            );
            
            -- Notifications
            CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY NOT NULL,
                userId TEXT,
                title TEXT,
                message TEXT,
                type TEXT,
                read INTEGER DEFAULT 0,
                createdAt TEXT,
                synced INTEGER DEFAULT 0
            );

            -- NEW TABLES --
            CREATE TABLE IF NOT EXISTS achievements (
                id TEXT PRIMARY KEY NOT NULL,
                userId TEXT,
                achievementId TEXT,
                unlockedAt TEXT,
                synced INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS water_logs (
                id TEXT PRIMARY KEY NOT NULL,
                userId TEXT,
                amount INTEGER,
                timestamp TEXT,
                synced INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS sleep_logs (
                id TEXT PRIMARY KEY NOT NULL,
                userId TEXT,
                sleepTime TEXT,
                wakeTime TEXT,
                quality TEXT,
                notes TEXT,
                synced INTEGER DEFAULT 0
            );

            -- PHASE 4A: Critical SQLite Parity
            CREATE TABLE IF NOT EXISTS recipes (
                id TEXT PRIMARY KEY NOT NULL,
                title TEXT,
                description TEXT,
                calories INTEGER,
                protein INTEGER,
                carbs INTEGER,
                fat INTEGER,
                ingredients TEXT,
                instructions TEXT,
                category TEXT,
                difficulty TEXT,
                prepTime INTEGER,
                isPremium INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS programs (
                id TEXT PRIMARY KEY NOT NULL,
                title TEXT,
                description TEXT,
                category TEXT,
                difficulty TEXT,
                duration INTEGER,
                goal TEXT,
                isPremium INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS program_workouts (
                id TEXT PRIMARY KEY NOT NULL,
                programId TEXT,
                workoutId TEXT,
                weekNumber INTEGER,
                dayNumber INTEGER
            );

            CREATE TABLE IF NOT EXISTS body_measurements (
                id TEXT PRIMARY KEY NOT NULL,
                userId TEXT,
                weight REAL,
                bodyFat REAL,
                muscleMass REAL,
                chest REAL,
                waist REAL,
                hips REAL,
                date TEXT,
                synced INTEGER DEFAULT 0
            );

            -- PHASE 4B: Medium Priority
            CREATE TABLE IF NOT EXISTS achievement_definitions (
                id TEXT PRIMARY KEY NOT NULL,
                title TEXT,
                description TEXT,
                icon TEXT,
                requirement TEXT,
                category TEXT
            );

            CREATE TABLE IF NOT EXISTS user_programs (
                id TEXT PRIMARY KEY NOT NULL,
                userId TEXT,
                programId TEXT,
                status TEXT,
                startDate TEXT,
                currentWeek INTEGER,
                currentDay INTEGER,
                synced INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS workout_progress (
                id TEXT PRIMARY KEY NOT NULL,
                userId TEXT,
                exerciseName TEXT,
                maxWeight REAL,
                maxReps INTEGER,
                date TEXT,
                synced INTEGER DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS exercises (
                id TEXT PRIMARY KEY NOT NULL,
                workoutId TEXT,
                name TEXT,
                sets INTEGER,
                reps TEXT,
                duration INTEGER,
                restTime INTEGER,
                instructions TEXT
            );
        `);

        // Migration attempt (safe to run even if column exists in some sqlite versions, or check pragma)
        // Since we updated CREATE TABLE, new users are fine. For existing users:
        try {
            // Check if column exists logic is complex in simple exec. 
            // Just try adding it, if it fails it likely exists or error is ignored.
            // Using try-catch with execSync is safe way to attempt migration.
            db.execSync('ALTER TABLE users ADD COLUMN initialWeight REAL;');
        } catch (e) {
            // Column likely already exists
        }

        try {
            db.execSync('ALTER TABLE chat_messages ADD COLUMN synced INTEGER DEFAULT 0;');
        } catch (e) { /* ignore */ }
        try {
            db.execSync('ALTER TABLE chat_messages ADD COLUMN userId TEXT;');
        } catch (e) { /* ignore */ }

        console.log('SQLite Database Initialized');
    },

    // --- USER ---
    saveUser: (user: UserProfile) => {
        db.runSync(`
            INSERT OR REPLACE INTO users (uid, name, email, hasOnboarded, weight, height, age, gender, goal, activityLevel, targetWeight, initialWeight)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [user.uid, user.name, user.email, user.hasOnboarded ? 1 : 0, user.weight, user.height, user.age, user.gender, user.goal, user.activityLevel, user.targetWeight, user.initialWeight || null]);
    },

    getUser: (uid: string): UserProfile | null => {
        const result = db.getFirstSync<UserProfile>('SELECT * FROM users WHERE uid = ?', [uid]);
        return result || null;
    },

    updateOnboardingStatus: (uid: string, status: boolean) => {
        db.runSync('UPDATE users SET hasOnboarded = ? WHERE uid = ?', [status ? 1 : 0, uid]);
    },

    // --- WORKOUTS ---
    saveWorkouts: (workouts: Workout[]) => {
        db.withTransactionSync(() => {
            for (const w of workouts) {
                db.runSync(`
                    INSERT OR REPLACE INTO workouts (id, title, description, category, difficulty, duration, calories, icon, json_data)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [w.id, w.title, w.description, w.category, w.difficulty, w.duration, w.calories, w.icon, JSON.stringify(w)]);
            }
        });
    },

    getAllWorkouts: (): Workout[] => {
        const rows = db.getAllSync<{ json_data: string }>('SELECT json_data FROM workouts');
        return rows.map((row: { json_data: string }) => JSON.parse(row.json_data));
    },

    // --- FOODS ---
    seedFoods: (foods: any[]) => {
        db.withTransactionSync(() => {
            for (const f of foods) {
                db.runSync(`
                    INSERT OR REPLACE INTO foods (id, name, calories, protein, carbs, fat, image)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [f.id, f.name, f.calories, f.protein, f.carbs, f.fat, f.image]);
            }
        });
    },

    searchFoods: (query: string): any[] => {
        if (!query) return [];
        return db.getAllSync<any>(`
            SELECT * FROM foods 
            WHERE name LIKE ? 
            LIMIT 50
        `, [`%${query}%`]);
    },

    getAllFoods: (): any[] => {
        return db.getAllSync<any>('SELECT * FROM foods LIMIT 20');
    },

    // --- LOGS ---
    logWorkout: (log: CompletedWorkout) => {
        db.runSync(`
            INSERT INTO completed_workouts (id, workoutId, date, duration, calories, synced)
            VALUES (?, ?, ?, ?, ?, 0)
        `, [log.id, log.workoutId, log.date, log.duration, log.calories]);
    },

    getUnsyncedLogs: () => {
        return db.getAllSync('SELECT * FROM completed_workouts WHERE synced = 0');
    },

    // Meals CRUD
    saveMeal: (meal: { id: string; userId: string; name: string; calories: number; protein: number; carbs: number; fat: number; time: string; image?: string }) => {
        db.runSync(
            `INSERT OR REPLACE INTO meals (id, userId, name, calories, protein, carbs, fat, time, image, synced)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
            [meal.id, meal.userId, meal.name, meal.calories, meal.protein, meal.carbs, meal.fat, meal.time, meal.image || null]
        );
    },

    getMeals: (userId: string, date: string): any[] => {
        const startDate = new Date(date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59, 59, 999);

        const rows = db.getAllSync<any>(
            `SELECT * FROM meals WHERE userId = ? AND time >= ? AND time <= ? ORDER BY time DESC`,
            [userId, startDate.toISOString(), endDate.toISOString()]
        );
        return rows;
    },

    getUnsyncedMeals: (): any[] => {
        return db.getAllSync<any>('SELECT * FROM meals WHERE synced = 0');
    },

    // --- ACHIEVEMENTS ---
    saveAchievements: (achievements: any[]) => {
        db.withTransactionSync(() => {
            for (const a of achievements) {
                db.runSync(`
                    INSERT OR REPLACE INTO achievements (id, userId, achievementId, unlockedAt, synced)
                    VALUES (?, ?, ?, ?, 1) -- 1 because fetched from server
                `, [a.id || `${a.userId}-${a.achievementId}`, a.userId, a.id, a.unlockedAt]);
            }
        });
    },

    getAchievements: (userId: string): any[] => {
        return db.getAllSync<any>('SELECT * FROM achievements WHERE userId = ?', [userId]);
    },

    // --- DAILY STATS ---
    saveDailyStats: (userId: string, stats: any) => {
        const date = new Date().toISOString().split('T')[0];
        db.runSync(`
            INSERT OR REPLACE INTO daily_stats (userId, date, calories, minutes, workouts, water, sleep, synced)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0)
        `, [userId, date, stats.calories, stats.minutes, stats.workouts, stats.water, stats.sleep]);
    },

    getDailyStats: (userId: string) => {
        const date = new Date().toISOString().split('T')[0];
        return db.getFirstSync<any>('SELECT * FROM daily_stats WHERE userId = ? AND date = ?', [userId, date]);
    },

    // --- PREFERENCES ---
    savePreferences: (userId: string, prefs: any) => {
        db.runSync(`
            INSERT OR REPLACE INTO user_preferences (userId, weightUnit, heightUnit, workoutReminder, reminderTime, dailyGoalAlert, theme, calorieGoal, synced)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
        `, [userId, prefs.weightUnit, prefs.heightUnit, prefs.workoutReminder ? 1 : 0, prefs.reminderTime, prefs.dailyGoalAlert ? 1 : 0, prefs.theme, prefs.calorieGoal]);
    },

    getPreferences: (userId: string) => {
        return db.getFirstSync<any>('SELECT * FROM user_preferences WHERE userId = ?', [userId]);
    },

    // --- CHAT ---
    saveChatMessage: (message: { id: string; text: string; sender: 'user' | 'ai'; timestamp: string; userId?: string, synced?: number }) => {
        db.runSync(
            `INSERT OR REPLACE INTO chat_messages (id, text, sender, timestamp, userId, synced) VALUES (?, ?, ?, ?, ?, ?)`,
            [message.id, message.text, message.sender, message.timestamp, message.userId || null, message.synced ?? 0]
        );
    },

    getChatMessages: (userId?: string): any[] => {
        return db.getAllSync<any>(`SELECT * FROM chat_messages ORDER BY timestamp ASC`);
    },

    getUnsyncedChatMessages: (): any[] => {
        return db.getAllSync('SELECT * FROM chat_messages WHERE synced = 0');
    },

    markChatMessagesAsSynced: (ids: string[]) => {
        if (ids.length === 0) return;
        const placeholders = ids.map(() => '?').join(',');
        db.runSync(`UPDATE chat_messages SET synced = 1 WHERE id IN (${placeholders})`, ids);
    },

    // --- PHASE 4A: CRITICAL PARITY METHODS ---

    // RECIPES
    saveRecipes: (recipes: any[]) => {
        db.withTransactionSync(() => {
            for (const r of recipes) {
                db.runSync(`
                    INSERT OR REPLACE INTO recipes (id, title, description, calories, protein, carbs, fat, ingredients, instructions, category, difficulty, prepTime, isPremium)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [r.id, r.title, r.description, r.calories, r.protein, r.carbs, r.fat,
                JSON.stringify(r.ingredients), JSON.stringify(r.instructions),
                r.category || null, r.difficulty || null, r.prepTime || null, r.isPremium ? 1 : 0]);
            }
        });
    },

    getRecipes: (): any[] => {
        return db.getAllSync<any>('SELECT * FROM recipes')
            .map(r => ({
                ...r,
                ingredients: JSON.parse(r.ingredients || '[]'),
                instructions: JSON.parse(r.instructions || '[]'),
                isPremium: r.isPremium === 1
            }));
    },

    // PROGRAMS
    savePrograms: (programs: any[]) => {
        db.withTransactionSync(() => {
            for (const p of programs) {
                db.runSync(`
                    INSERT OR REPLACE INTO programs (id, title, description, category, difficulty, duration, goal, isPremium)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [p.id, p.title, p.description, p.category, p.difficulty, p.duration, p.goal || null, p.isPremium ? 1 : 0]);
            }
        });
    },

    getPrograms: (): any[] => {
        return db.getAllSync<any>('SELECT * FROM programs')
            .map(p => ({ ...p, isPremium: p.isPremium === 1 }));
    },

    saveProgramWorkouts: (programWorkouts: any[]) => {
        db.withTransactionSync(() => {
            for (const pw of programWorkouts) {
                db.runSync(`
                    INSERT OR REPLACE INTO program_workouts (id, programId, workoutId, weekNumber, dayNumber)
                    VALUES (?, ?, ?, ?, ?)
                `, [pw.id, pw.programId, pw.workoutId, pw.weekNumber, pw.dayNumber]);
            }
        });
    },

    getProgramWorkouts: (programId: string): any[] => {
        return db.getAllSync<any>('SELECT * FROM program_workouts WHERE programId = ?', [programId]);
    },

    // COMPLETED WORKOUTS (Updated)
    saveCompletedWorkout: (workout: any, userId: string) => {
        db.runSync(`
            INSERT OR REPLACE INTO completed_workouts (id, userId, workoutId, date, duration, calories, synced)
            VALUES (?, ?, ?, ?, ?, ?, 0)
        `, [workout.id, userId, workout.workoutId.toString(), workout.date, workout.duration, workout.calories]);
    },

    getCompletedWorkouts: (userId: string): any[] => {
        return db.getAllSync<any>('SELECT * FROM completed_workouts WHERE userId = ? ORDER BY date DESC', [userId])
            .map(row => ({
                id: row.id,
                workoutId: parseInt(row.workoutId),
                date: row.date,
                duration: row.duration,
                calories: row.calories
            }));
    },

    getUnsyncedCompletedWorkouts: (): any[] => {
        return db.getAllSync('SELECT * FROM completed_workouts WHERE synced = 0');
    },

    markCompletedWorkoutsAsSynced: (ids: string[]) => {
        if (ids.length === 0) return;
        const placeholders = ids.map(() => '?').join(',');
        db.runSync(`UPDATE completed_workouts SET synced = 1 WHERE id IN (${placeholders})`, ids);
    },

    // CUSTOM WORKOUTS
    saveCustomWorkout: (workout: any, userId: string) => {
        db.runSync(`
            INSERT OR REPLACE INTO custom_workouts (id, userId, title, description, category, difficulty, duration, calories, exercises, synced)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        `, [workout.id, userId, workout.title, workout.description, workout.category,
        workout.difficulty, workout.duration, workout.calories, JSON.stringify(workout.exercises || [])]);
    },

    getCustomWorkouts: (userId: string): any[] => {
        return db.getAllSync<any>('SELECT * FROM custom_workouts WHERE userId = ?', [userId])
            .map(row => ({
                ...row,
                exercises: JSON.parse(row.exercises || '[]')
            }));
    },

    // BODY MEASUREMENTS
    saveBodyMeasurement: (measurement: any, userId: string) => {
        db.runSync(`
            INSERT OR REPLACE INTO body_measurements (id, userId, weight, bodyFat, muscleMass, chest, waist, hips, date, synced)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        `, [measurement.id, userId, measurement.weight, measurement.bodyFat || null,
        measurement.muscleMass || null, measurement.chest || null, measurement.waist || null,
        measurement.hips || null, measurement.date]);
    },

    getBodyMeasurements: (userId: string): any[] => {
        return db.getAllSync<any>('SELECT * FROM body_measurements WHERE userId = ? ORDER BY date DESC', [userId]);
    },

    // --- PHASE 4B: MEDIUM PRIORITY METHODS ---

    // ACHIEVEMENT DEFINITIONS
    saveAchievementDefinitions: (achievements: any[]) => {
        db.withTransactionSync(() => {
            for (const a of achievements) {
                db.runSync(`
                    INSERT OR REPLACE INTO achievement_definitions (id, title, description, icon, requirement, category)
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [a.id, a.title, a.description, a.icon, a.requirement, a.category]);
            }
        });
    },

    getAchievementDefinitions: (): any[] => {
        return db.getAllSync<any>('SELECT * FROM achievement_definitions');
    },

    // USER PROGRAMS
    saveUserProgram: (enrollment: any, userId: string) => {
        db.runSync(`
            INSERT OR REPLACE INTO user_programs (id, userId, programId, status, startDate, currentWeek, currentDay, synced)
            VALUES (?, ?, ?, ?, ?, ?, ?, 0)
        `, [enrollment.id, userId, enrollment.programId, enrollment.status,
        enrollment.startDate, enrollment.currentWeek, enrollment.currentDay]);
    },

    getUserPrograms: (userId: string): any[] => {
        return db.getAllSync<any>('SELECT * FROM user_programs WHERE userId = ?', [userId]);
    },

    // WORKOUT PROGRESS (PRs)
    saveWorkoutProgress: (progress: any, userId: string) => {
        db.runSync(`
            INSERT OR REPLACE INTO workout_progress (id, userId, exerciseName, maxWeight, maxReps, date, synced)
            VALUES (?, ?, ?, ?, ?, ?, 0)
        `, [progress.id, userId, progress.exerciseName, progress.maxWeight, progress.maxReps, progress.date]);
    },

    getWorkoutProgress: (userId: string, exerciseName?: string): any[] => {
        if (exerciseName) {
            return db.getAllSync<any>('SELECT * FROM workout_progress WHERE userId = ? AND exerciseName = ? ORDER BY date DESC',
                [userId, exerciseName]);
        }
        return db.getAllSync<any>('SELECT * FROM workout_progress WHERE userId = ? ORDER BY date DESC', [userId]);
    },

    // EXERCISES
    saveExercises: (exercises: any[]) => {
        db.withTransactionSync(() => {
            for (const e of exercises) {
                db.runSync(`
                    INSERT OR REPLACE INTO exercises (id, workoutId, name, sets, reps, duration, restTime, instructions)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [e.id, e.workoutId, e.name, e.sets, e.reps, e.duration || null, e.restTime || null, e.instructions || null]);
            }
        });
    },

    getExercises: (workoutId: string): any[] => {
        return db.getAllSync<any>('SELECT * FROM exercises WHERE workoutId = ?', [workoutId]);
    },

    // WATER LOGS (connect existing table)
    saveWaterLog: (log: any, userId: string) => {
        db.runSync(`
            INSERT OR REPLACE INTO water_logs (id, userId, amount, timestamp, synced)
            VALUES (?, ?, ?, ?, 0)
        `, [log.id, userId, log.amount, log.timestamp]);
    },

    getWaterLogs: (userId: string, date?: string): any[] => {
        if (date) {
            const startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);

            return db.getAllSync<any>(
                'SELECT * FROM water_logs WHERE userId = ? AND timestamp >= ? AND timestamp <= ? ORDER BY timestamp DESC',
                [userId, startDate.toISOString(), endDate.toISOString()]
            );
        }
        return db.getAllSync<any>('SELECT * FROM water_logs WHERE userId = ? ORDER BY timestamp DESC LIMIT 100', [userId]);
    },

    // SLEEP LOGS (connect existing table)
    saveSleepLog: (log: any, userId: string) => {
        db.runSync(`
            INSERT OR REPLACE INTO sleep_logs (id, userId, sleepTime, wakeTime, quality, notes, synced)
            VALUES (?, ?, ?, ?, ?, ?, 0)
        `, [log.id, userId, log.sleepTime, log.wakeTime, log.quality, log.notes || null]);
    },

    getSleepLogs: (userId: string, limit: number = 30): any[] => {
        return db.getAllSync<any>('SELECT * FROM sleep_logs WHERE userId = ? ORDER BY sleepTime DESC LIMIT ?', [userId, limit]);
    }
};

