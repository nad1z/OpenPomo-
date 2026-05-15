import { create } from 'zustand';
import { PomodoroSession } from '../../domain/entities/PomodoroSession';
import { HistoryFilter } from '../../domain/useCases/GetSessionHistoryUseCase';
import { container } from '../../infrastructure/container';
import { GetSessionHistoryUseCase } from '../../domain/useCases/GetSessionHistoryUseCase';
import { toSessionDTO, SessionDTO } from '../../application/dto/SessionDTO';

interface HistoryStore {
  sessions: SessionDTO[];
  filter: HistoryFilter;
  isLoading: boolean;
  error: string | null;

  load: (filter: HistoryFilter) => Promise<void>;
  setFilter: (filter: HistoryFilter) => void;
  deleteSession: (id: string) => Promise<void>;
  exportCsv: () => Promise<void>;
}

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  sessions: [],
  filter: 'today',
  isLoading: false,
  error: null,

  load: async (filter) => {
    set({ isLoading: true, error: null, filter });
    try {
      const useCase = new GetSessionHistoryUseCase(container.sessionRepository);
      const sessions = await useCase.execute({ filter });
      set({ sessions: sessions.map(toSessionDTO), isLoading: false });
    } catch {
      set({ error: 'Failed to load history', isLoading: false });
    }
  },

  setFilter: (filter) => {
    get().load(filter);
  },

  deleteSession: async (id) => {
    await container.sessionRepository.delete(id);
    const { filter } = get();
    await get().load(filter);
  },

  exportCsv: async () => {
    const useCase = new GetSessionHistoryUseCase(container.sessionRepository);
    const sessions = await useCase.execute({ filter: 'all' });
    await container.csvExportService.exportSessions(sessions);
  },
}));
