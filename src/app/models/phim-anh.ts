export class PhimAnh {
  public PHIMANHID: string = '';
  public MA_DTQS: string = '';
  public THOIDIEMCHUP: string | null = null;
  public THOIDIEMLUU: string | null = null;
  public THIETBICHUP: string = '';
  public X: number = 0;
  public Y: number = 0;
  public NGUOI_CN: string = '';
  public GHICHU: string = '';
  public LOAY_TB: string = '';
  public MADV: string = '';
  public MAKVHC: string = '';
  public DUONGDANFILE: string = '';
  public DUNGLUONG: number = 0;
  constructor(init?: Partial<PhimAnh>) {
    Object.assign(this, init);
  }
}
