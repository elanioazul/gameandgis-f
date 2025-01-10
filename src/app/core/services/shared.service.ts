import { Injectable, WritableSignal, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private _openedWindows: WritableSignal<Window[]> = signal([]);

  public get openedWindows() : Window[] {
    return this._openedWindows();
  }

  public set openedWindows(wind : Window) {
    this._openedWindows.update(windList => {
      windList.push(wind);
      return windList;
    });
  }

  public emptyOpenedWindows(): void {
    this._openedWindows.set([]);
  }
}
