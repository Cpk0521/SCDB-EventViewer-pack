declare const __VERSION__: string;

//https://github.com/pixijs/pixijs/issues/8957
declare namespace GlobalMixins {
	interface DisplayObjectEvents extends FederatedEventEmitterTypes {
		[label: ({} & string) | ({} & symbol)]: any;
	}
}