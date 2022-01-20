import { ScreenCordinate } from '.';

export class PopupPhimAnh {
  public iD: number = 0;
  public screenCoordinate!: ScreenCordinate;
  public isShow: boolean = false;
  constructor(init?: Partial<PopupPhimAnh>) {
    Object.assign(this, init);
  }
}
