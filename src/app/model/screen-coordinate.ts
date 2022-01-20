export class ScreenCordinate {
  public x: number = 0;
  public y: number = 0;
  constructor(init?: Partial<ScreenCordinate>) {
    Object.assign(this, init);
  }
}
