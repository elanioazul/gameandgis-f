import { Injectable, computed, signal } from '@angular/core';
import { IReadVisor } from '../interfaces/visor/visor.interface';
import { Message } from 'primeng/api';
import { Subject } from 'rxjs';
import { ITool } from '../interfaces/tool/tool.interface';
export interface VisorState {
  config: IReadVisor | null;
  mapTools: ITool[];
  mapActiveTool: ITool | null;
  loaded: boolean;
  error: Message | null;
}

@Injectable()
export class VisorService {
  // state
  private state = signal<VisorState>({
    config: null,
    mapTools: [],
    mapActiveTool: null,
    loaded: false,
    error: null,
  });

  //selectors
  config = computed(() => this.state().config);
  mapTools = computed(() => this.state().mapTools);
  mapActiveTool = computed(() => this.state().mapActiveTool);

  //sources
  readVisorConfig$ = new Subject<IReadVisor>();
  addTool$ = new Subject<ITool>();
  toogleTool$ = new Subject<ITool>();

  constructor() {
    // this.readVisorConfig$.subscribe({
    //   next: (config: IReadVisor) =>
    //     this.state.update((state) => ({
    //       ...state,
    //       config: config,
    //       loaded: true
    //     })),
    //   error: (err) => this.state.update((state) => ({ ...state, error: err })),
    // })
    this.addTool$.subscribe((tool: ITool) =>
      this.state.update((state) => ({
        ...state,
        mapTools: [...state.mapTools, tool],
      }))
    );

    this.toogleTool$.subscribe((tool: ITool) => {
      this.state.update((state) => ({
        ...state,
        mapTools: state.mapTools.map((item: ITool) =>
          item.key === tool.key
            ? { ...item, checked: !item.config.active }
            : item
        ),
        mapActiveTool: tool,
      }));
    });
  }

  setVisorState(config: IReadVisor): void {
    this.state.update((state) => ({ ...state, config: config, loaded: true }));
  }
}
