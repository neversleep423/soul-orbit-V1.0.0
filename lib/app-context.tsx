import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RelationModel {
  id: string;
  name: string;
  mbti: string;
  relationType: string;
}

export interface UserModel {
  isTestCompleted: boolean;
  mbtiResult: string;
  isPremiumUser: boolean;
}

interface AppContextType {
  user: UserModel;
  relations: RelationModel[];
  setMbtiResult: (mbti: string) => Promise<void>;
  setIsPremiumUser: (isPremium: boolean) => Promise<void>;
  addRelation: (relation: Omit<RelationModel, 'id'>) => Promise<void>;
  removeRelation: (id: string) => Promise<void>;
  resetTest: () => Promise<void>;
  isLoading: boolean;
}

const defaultUser: UserModel = {
  isTestCompleted: false,
  mbtiResult: '',
  isPremiumUser: false,
};

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  USER: 'soul_orbit_user',
  RELATIONS: 'soul_orbit_relations',
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserModel>(defaultUser);
  const [relations, setRelations] = useState<RelationModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [userStr, relationsStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.USER),
        AsyncStorage.getItem(STORAGE_KEYS.RELATIONS),
      ]);
      if (userStr) setUser(JSON.parse(userStr));
      if (relationsStr) setRelations(JSON.parse(relationsStr));
    } catch (e) {
      console.error('Failed to load data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (newUser: UserModel) => {
    setUser(newUser);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
  };

  const saveRelations = async (newRelations: RelationModel[]) => {
    setRelations(newRelations);
    await AsyncStorage.setItem(STORAGE_KEYS.RELATIONS, JSON.stringify(newRelations));
  };

  const setMbtiResult = async (mbti: string) => {
    await saveUser({ ...user, mbtiResult: mbti, isTestCompleted: true });
  };

  const setIsPremiumUser = async (isPremium: boolean) => {
    await saveUser({ ...user, isPremiumUser: isPremium });
  };

  const addRelation = async (relation: Omit<RelationModel, 'id'>) => {
    const newRelation: RelationModel = {
      ...relation,
      id: Date.now().toString(),
    };
    await saveRelations([...relations, newRelation]);
  };

  const removeRelation = async (id: string) => {
    await saveRelations(relations.filter((r) => r.id !== id));
  };

  const resetTest = async () => {
    await saveUser(defaultUser);
    await saveRelations([]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        relations,
        setMbtiResult,
        setIsPremiumUser,
        addRelation,
        removeRelation,
        resetTest,
        isLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
