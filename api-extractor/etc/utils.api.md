## API Report File for "@keywork/utils"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

/// <reference types="@cloudflare/workers-types" />

// @public (undocumented)
export function arrayBufferToBase64(arrayBuffer: ArrayBuffer): string;

// @public (undocumented)
export function arrayBufferToString(buf: ArrayBuffer): string;

// @public
export class CachableResponse extends Response {
    constructor(
    body: BodyInit | null,
    request?: Request,
    etag?: string | null,
    cacheControlOptions?: Partial<CacheControlDirectives>,
    headersInit?: HeadersInit);
}

// @public
export interface CacheControlDirectives {
    // (undocumented)
    'max-age': number;
    // (undocumented)
    'must-revalidate': boolean;
    // (undocumented)
    [cacheControlKey: string]: number | boolean | string;
    // (undocumented)
    immutable: boolean;
}

// @public (undocumented)
export type CacheControlHeader = HeadersInit & {
    'Cache-Control': string;
};

// @public (undocumented)
export type ContentTypeHeader = HeadersInit & {
    'Content-Type': string;
};

// @public
export const convertJSONToETaggableString: (value: {}) => string;

// @public (undocumented)
export function createCacheControlHeader(options: Partial<CacheControlDirectives> | undefined): CacheControlHeader;

// @public
export const DURATION_FIVE_MINUTES: number;

// @public
export const DURATION_ONE_DAY: number;

// @public
export const DURATION_ONE_HOUR: number;

// @public
export const DURATION_ONE_WEEK: number;

// @internal
export const _EMPTY_ETAG = "\"0-2jmj7l5rSw0yVb/vlWAYkK/YBwk\"";

// @public (undocumented)
export interface EntityToETagOptions {
    weak?: boolean;
}

// @public (undocumented)
export interface ErrorJSONBody {
    // (undocumented)
    status: string;
    // (undocumented)
    statusCode: number;
}

// @public
export class ErrorResponse extends Response {
    constructor(
    status?: number,
    statusText?: string,
    body?: BodyInit | null,
    headersInit?: HeadersInit);
    static fromUnknownError(
    _error: any,
    publicReason?: string): ErrorResponse;
}

// @public
export type ETaggable = string | ArrayBuffer;

// @public
export function fileExtensionToContentTypeHeader(extension: string, mimeTypeFallback?: "txt"): ContentTypeHeader;

// @public
export function generateETag(entity: ETaggable, options?: EntityToETagOptions): Promise<string>;

// @public (undocumented)
export function getBrowserIdentifier(request: Request): string;

// @public (undocumented)
export interface GlobalConsoleLike {
    // (undocumented)
    debug(message?: any, ...optionalParams: any[]): void;
    // (undocumented)
    error(message?: any, ...optionalParams: any[]): void;
    // (undocumented)
    info(message?: any, ...optionalParams: any[]): void;
    // (undocumented)
    log(message?: any, ...optionalParams: any[]): void;
    // (undocumented)
    warn(message?: any, ...optionalParams: any[]): void;
}

// @public (undocumented)
export function hexToDec(hexStr: string): string;

// @public
export class HTMLResponse extends CachableResponse {
    constructor(
    htmlContent: string | ReadableStream,
    request?: Request,
    etag?: string,
    cacheControlOptions?: CacheControlDirectives,
    headersInit?: HeadersInit);
}

// @public
export function isETagMatch(request: Request, etag: string | null | undefined): etag is string;

// @public (undocumented)
export function isRequestLike(requestish: unknown): requestish is RequestLike;

// @public (undocumented)
export function isURLLike(urlish: unknown): urlish is URLLike;

// @public
export class JSONResponse extends CachableResponse {
    constructor(
    json: {},
    request?: Request,
    etag?: string,
    cacheControlOptions?: CacheControlDirectives,
    headersInit?: HeadersInit,
    pretty?: boolean);
}

// @public (undocumented)
export enum KeyworkQueryParamKeys {
    BuildID = "build-id",
    StaticProps = "static-props"
}

// @public
export class KeyworkResourceError extends Error {
    constructor(statusText: string, status?: number);
    static fromUnknownError(
    _error: any): KeyworkResourceError;
    // (undocumented)
    get message(): string;
    // (undocumented)
    status: number;
    // (undocumented)
    statusText: string;
    // (undocumented)
    toJSON(): ErrorJSONBody;
}

// @public
export function matchPath<ExpectedParams extends {} | null, Path extends string>(pattern: PathPattern<Path> | Path, pathname: string): PathMatch<ExpectedParams> | null;

// @internal (undocumented)
export type _Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

// @public
export class NotModifiedResponse extends Response {
    constructor(etag: string);
}

// @public (undocumented)
export function numberInRange(given: number, minimum?: number, maximum?: number): number;

// @internal (undocumented)
export type _ParamParseFailed = {
    failed: true;
};

// @internal
export type _ParamParseKey<Segment extends string> = _ParamParseSegment<Segment> extends string ? _ParamParseSegment<Segment> : string;

// @internal (undocumented)
export type _ParamParseSegment<Segment extends string> = Segment extends `${infer LeftSegment}/${infer RightSegment}` ? _ParamParseSegment<LeftSegment> extends infer LeftResult ? _ParamParseSegment<RightSegment> extends infer RightResult ? LeftResult extends string ? RightResult extends string ? LeftResult | RightResult : LeftResult : RightResult extends string ? RightResult : _ParamParseFailed : _ParamParseFailed : _ParamParseSegment<RightSegment> extends infer RightResult ? RightResult extends string ? RightResult : _ParamParseFailed : _ParamParseFailed : Segment extends `:${infer Remaining}` ? Remaining : _ParamParseFailed;

// @public
export type ParsedPathParams<Key extends string = string> = {
    readonly [key in Key]: string | undefined;
};

// @public
export function parsePathname<ExpectedParams extends {} | null>(pattern: PathPattern<string> | string, urlOrRequest: Pick<Request, 'url'> | string | URL): PathMatch<ExpectedParams>;

// @public (undocumented)
export type PathBuilder = (...collectionPath: Array<string | undefined>) => string;

// @public
export interface PathMatch<ExpectedParams extends {} | null = null> {
    params: ExpectedParams;
    pathname: string;
    pathnameBase: string;
    pattern: PathPattern;
}

// @public
export interface PathPattern<Path extends string = string> {
    caseSensitive?: boolean;
    end?: boolean;
    path: Path;
}

// @public
export class PrefixedLogger {
    constructor(logPrefix: string, color?: string);
    // (undocumented)
    debug: GlobalConsoleLike['debug'];
    // (undocumented)
    error: (error: unknown) => void;
    // (undocumented)
    protected _error: GlobalConsoleLike['error'];
    // (undocumented)
    info: GlobalConsoleLike['info'];
    // (undocumented)
    json(json: {}): void;
    // (undocumented)
    jsonEntries<T>(label: string, json: Iterable<T>, key: keyof T): void;
    // (undocumented)
    log: GlobalConsoleLike['log'];
    // (undocumented)
    _log: GlobalConsoleLike['log'];
    // (undocumented)
    protected logPrefix: string;
    // (undocumented)
    warn: GlobalConsoleLike['warn'];
}

// @public (undocumented)
export type PrettyJSON = (...args: Parameters<typeof JSON.stringify>) => string;

// @public (undocumented)
export const prettyJSON: PrettyJSON;

// @public (undocumented)
export type RequestLike = Pick<Request, 'url'>;

// @public
export const resolveDocPath: PathBuilder;

// @public
export class SnowflakeID {
    constructor(options?: {
        mid?: number;
        offset?: number;
    });
    // (undocumented)
    generate(): string;
}

// @public (undocumented)
export function stringToArrayBuffer(str: string): ArrayBuffer;

// @public (undocumented)
export type URLLike = Pick<URL, 'pathname'>;

// (No @packageDocumentation comment for this package)

```