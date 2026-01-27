declare module "@transak/transak-sdk" {
  export default class TransakSDK {
    constructor(options: any);
    init(): void;
    close(): void;
    on(event: string, callback: (data: any) => void): void;
    EVENTS: Record<string, string>;
  }
}
