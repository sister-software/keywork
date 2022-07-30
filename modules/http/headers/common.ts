/**
 * @file This file is part of the Keywork project.
 * @copyright Nirrius, LLC. All rights reserved.
 * @author Teffen Ellis, et al.
 * @license AGPL-3.0
 *
 * @remarks Keywork is free software for non-commercial purposes.
 * You can be released from the requirements of the license by purchasing a commercial license.
 * Buying such a license is mandatory as soon as you develop commercial activities
 * involving the Keywork software without disclosing the source code of your own applications.
 *
 * @see LICENSE.md in the project root for further licensing information.
 */

/**
 * @ignore
 */
export const KeyworkHeaders = {
  'X-Powered-By': 'Keywork',
}

/**
 * Merges the given source headers into the destination.
 *
 * @remarks
 * This mutates the `destination` headers.
 *
 */
export function mergeHeaders(destination: globalThis.Headers, ...sources: globalThis.Headers[]): void {
  for (const source of sources) {
    for (const [name, value] of source.entries()) {
      destination.set(name, value)
    }
  }
}

export interface CookieHeaders {
  /** Contains stored [HTTP cookies](/en-US/docs/Web/HTTP/Cookies) previously sent by the server with the {{HTTPHeader("Set-Cookie")}} header. */
  Cookie: string
  /** Send cookies from the server to the user-agent. */
  'Set-Cookie': string
}

export interface AuthenticationHeaders {
  /** Defines the authentication method that should be used to access a resource. */
  'WWW-Authenticate': string
  /** Contains the credentials to authenticate a user-agent with a server. */
  Authorization: string
  /** Defines the authentication method that should be used to access a resource behind a proxy server. */
  'Proxy-Authenticate': string
  /** Contains the credentials to authenticate a user agent with a proxy server. */
  'Proxy-Authorization': string
}

// The [UA client hints](/en-US/docs/Web/HTTP/Client_hints#user-agent_client_hints) are request headers that provide information about the user agent and the platform/architecture on which it is running:

export interface UserAgentClientHintHeaders {
  /**
   * @beta
   *User agent's branding and version.
   */
  'Sec-CH-UA': string
  /**
   * @beta
   *User agent's underlying platform architecture.
   */
  'Sec-CH-UA-Arch': string
  /**
   * @beta
   *User agent's underlying CPU architecture bitness (for example "64" bit).
   */
  'Sec-CH-UA-Bitness': string
  /** @beta *
  "Sec-CH-UA-Full-Version-List": string
  /**
   * @beta
   *User agent is running on a mobile device or, more generally, prefers a "mobile" user experience.
   */
  'Sec-CH-UA-Mobile': string
  /**
   * @beta
   *User agent's device model.
   */
  'Sec-CH-UA-Model': string
  /**
   * @beta
   *User agent's underlying operation system/platform.
   */
  'Sec-CH-UA-Platform': string
  /**
   * @beta
   *User agent's underlying operation system version.
   */
  'Sec-CH-UA-Platform-Version': string
}

// Network client hints allow a server to choose what information is sent based on the user choice and network bandwidth and latency.
export interface NetworkClientHintHeaders {
  /** Approximate bandwidth of the client's connection to the server, in Mbps. This is part of the [Network Information API](/en-US/docs/Web/API/Network_Information_API). */
  Downlink: string
  /** The {{Glossary("effective connection type")}} ("network profile") that best matches the connection's latency and bandwidth. This is part of the [Network Information API](/en-US/docs/Web/API/Network_Information_API). */
  ECT: string
  /** Application layer round trip time (RTT) in milliseconds, which includes the server processing time. This is part of the [Network Information API](/en-US/docs/Web/API/Network_Information_API). */
  RTT: string
  /**
   * @beta
   *A boolean that indicates the user agent's preference for reduced data usage.
   */
  'Save-Data': string
}

export interface Conditionals {
  /** The last modification date of the resource, used to compare several versions of the same resource. It is less accurate than {{HTTPHeader("ETag")}}, but easier to calculate in some environments. Conditional requests using {{HTTPHeader("If-Modified-Since")}} and {{HTTPHeader("If-Unmodified-Since")}} use this value to change the behavior of the request. */
  'Last-Modified': string
  /** A unique string identifying the version of the resource. Conditional requests using {{HTTPHeader("If-Match")}} and {{HTTPHeader("If-None-Match")}} use this value to change the behavior of the request. */
  ETag: string
  /** Makes the request conditional, and applies the method only if the stored resource matches one of the given ETags. */
  'If-Match': string
  /** Makes the request conditional, and applies the method only if the stored resource _doesn't_ match any of the given ETags. This is used to update caches (for safe requests), or to prevent uploading a new resource when one already exists. */
  'If-None-Match': string
  /** Makes the request conditional, and expects the resource to be transmitted only if it has been modified after the given date. This is used to transmit data only when the cache is out of date. */
  'If-Modified-Since': string
  /** Makes the request conditional, and expects the resource to be transmitted only if it has not been modified after the given date. This ensures the coherence of a new fragment of a specific range with previous ones, or to implement an optimistic concurrency control system when modifying existing documents. */
  'If-Unmodified-Since': string
  /** Determines how to match request headers to decide whether a cached response can be used rather than requesting a fresh one from the origin server. */
  Vary: string
}

export interface ConnectionManagement {
  /** Controls whether the network connection stays open after the current transaction finishes. */
  Connection: string
  /** Controls how long a persistent connection should stay open. */
  'Keep-Alive': string
}

// [Content negotiation](/en-US/docs/Web/HTTP/Content_negotiation) headers.
export interface ContentNegotiation {
  /** Informs the server about the {{Glossary("MIME_type", "types")}} of data that can be sent back. */
  Accept: string
  /** The encoding algorithm, usually a [compression algorithm](/en-US/docs/Web/HTTP/Compression), that can be used on the resource sent back. */
  'Accept-Encoding': string
  /** Informs the server about the human language the server is expected to send back. This is a hint and is not necessarily under the full control of the user: the server should always pay attention not to override an explicit user choice (like selecting a language from a dropdown). */
  'Accept-Language': string
}

export interface CORSHeaders {
  /** Indicates whether the response can be shared. */
  'Access-Control-Allow-Origin': string
  /** Indicates whether the response to the request can be exposed when the credentials flag is true. */
  'Access-Control-Allow-Credentials': string
  /** Used in response to a {{Glossary("Preflight_request", "preflight request")}} to indicate which HTTP headers can be used when making the actual request. */
  'Access-Control-Allow-Headers': string
  /** Specifies the methods allowed when accessing the resource in response to a preflight request. */
  'Access-Control-Allow-Methods': string
  /** Indicates which headers can be exposed as part of the response by listing their names. */
  'Access-Control-Expose-Headers': string
  /** Indicates how long the results of a preflight request can be cached. */
  'Access-Control-Max-Age': string
  /** Used when issuing a preflight request to let the server know which HTTP headers will be used when the actual request is made. */
  'Access-Control-Request-Headers': string
  /** Used when issuing a preflight request to let the server know which [HTTP method](/en-US/docs/Web/HTTP/Methods) will be used when the actual request is made. */
  'Access-Control-Request-Method': string
  /** Indicates where a fetch originates from. */
  Origin: string
  /** Specifies origins that are allowed to see values of attributes retrieved via features of the [Resource Timing API](/en-US/docs/Web/API/Resource_Timing_API), which would otherwise be reported as zero due to cross-origin restrictions. */
  'Timing-Allow-Origin': string
}

export interface DownloadsHeaders {
  /** Indicates if the resource transmitted should be displayed inline (default behavior without the header), or if it should be handled like a download and the browser should present a "Save As" dialog. */
  'Content-Disposition': string
}

export interface MessageBodyInformationHeaders {
  /** The size of the resource, in decimal number of bytes. */
  'Content-Length': string
  /** Indicates the media type of the resource. */
  'Content-Type': string
  /** Used to specify the compression algorithm. */
  'Content-Encoding': string
  /** Describes the human language(s) intended for the audience, so that it allows a user to differentiate according to the users' own preferred language. */
  'Content-Language': string
  /** Indicates an alternate location for the returned data. */
  'Content-Location': string
}

export interface ProxyHeaders {
  /** Contains information from the client-facing side of proxy servers that is altered or lost when a proxy is involved in the path of the request. */
  Forwarded: string
  /** Identifies the originating IP addresses of a client connecting to a web server through an HTTP proxy or a load balancer. */
  'X-Forwarded-For': string
  /** Identifies the original host requested that a client used to connect to your proxy or load balancer. */
  'X-Forwarded-Host': string
  /** Identifies the protocol (HTTP or HTTPS) that a client used to connect to your proxy or load balancer. */
  'X-Forwarded-Proto': string
  /** Added by proxies, both forward and reverse proxies, and can appear in the request headers and the response headers. */
  Via: string
}

export interface RedirectHeaders {
  /** Indicates the URL to redirect a page to. */
  Location: string
}

export interface RequestContextHeaders {
  /** Contains an Internet email address for a human user who controls the requesting user agent. */
  From: string
  /** Specifies the domain name of the server (for virtual hosting), and (optionally) the TCP port number on which the server is listening. */
  Host: string
  /** The address of the previous web page from which a link to the currently requested page was followed. */
  Referer: string
  /** Governs which referrer information sent in the {{HTTPHeader("Referer")}} header should be included with requests made. */
  'Referrer-Policy': string
  /** Contains a characteristic string that allows the network protocol peers to identify the application type, operating system, software vendor or software version of the requesting software user agent. See also the [Firefox user agent string reference](/en-US/docs/Web/HTTP/Headers/User-Agent/Firefox). */
  'User-Agent': string
}

export interface ResponseContextHeaders {
  /** Lists the set of HTTP request methods supported by a resource. */
  Allow: string
  /** Contains information about the software used by the origin server to handle the request. */
  Server: string
}

export interface RangeRequestsHeaders {
  /** Indicates if the server supports range requests, and if so in which unit the range can be expressed. */
  'Accept-Ranges': string
  /** Indicates the part of a document that the server should return. */
  Range: string
  /** Creates a conditional range request that is only fulfilled if the given etag or date matches the remote resource. Used to prevent downloading two ranges from incompatible version of the resource. */
  'If-Range': string
  /** Indicates where in a full body message a partial message belongs. */
  'Content-Range': string
}

export interface SecurityHeaders {
  /** Allows a server to declare an embedder policy for a given document. */
  'Cross-Origin-Embedder-Policy': string
  /** Prevents other domains from opening/controlling a window. */
  'Cross-Origin-Opener-Policy': string
  /** Prevents other domains from reading the response of the resources to which this header is applied. */
  'Cross-Origin-Resource-Policy': string
  /** Controls resources the user agent is allowed to load for a given page. */
  'Content-Security-Policy': string
  /** Allows web developers to experiment with policies by monitoring, but not enforcing, their effects. These violation reports consist of {{Glossary("JSON")}} documents sent via an HTTP `POST` request to the specified URI. */
  'Content-Security-Policy-Report-Only': string
  /** Allows sites to opt in to reporting and/or enforcement of Certificate Transparency requirements, which prevents the use of misissued certificates for that site from going unnoticed. When a site enables the Expect-CT header, they are requesting that Chrome check that any certificate for that site appears in public CT logs. */
  'Expect-CT': string
  /** Provides a mechanism to allow and deny the use of browser features in its own frame, and in iframes that it embeds. */
  'Feature-Policy': string
  /**
   * @beta
   *Provides a mechanism to allow web applications to isolate their origins.
   */
  'Origin-Isolation': string
  /** Force communication using HTTPS instead of HTTP. */
  'Strict-Transport-Security': string
  /** Sends a signal to the server expressing the client's preference for an encrypted and authenticated response, and that it can successfully handle the {{CSP("upgrade-insecure-requests")}} directive. */
  'Upgrade-Insecure-Requests': string
}

// {{Glossary("Fetch metadata request header", "Fetch metadata request headers")}} provides information about the context from which the request originated. This allows a server to make decisions about whether a request should be allowed based on where the request came from and how the resource will be used.
export interface FetchMetadataRequestHeaders {
  /** It is a request header that indicates the relationship between a request initiator's origin and its target's origin. It is a Structured Header whose value is a token with possible values `cross-site`, `same-origin`, `same-site`, and `none`. */
  'Sec-Fetch-Site': string
  /** It is a request header that indicates the request's mode to a server. It is a Structured Header whose value is a token with possible values `cors`, `navigate`, `no-cors`, `same-origin`, and `websocket`. */
  'Sec-Fetch-Mode': string
  /** It is a request header that indicates whether or not a navigation request was triggered by user activation. It is a Structured Header whose value is a boolean so possible values are `?0` for false and `?1` for true. */
  'Sec-Fetch-User': string
  /** It is a request header that indicates the request's destination to a server. It is a Structured Header whose value is a token with possible values `audio`, `audioworklet`, `document`, `embed`, `empty`, `font`, `image`, `manifest`, `object`, `paintworklet`, `report`, `script`, `serviceworker`, `sharedworker`, `style`, `track`, `video`, `worker`, and `xslt`. */
  'Sec-Fetch-Dest': string
  /** A request header sent in preemptive request to`fetch()` a resource during service worker boot. */
  'Service-Worker-Navigation-Preload': string
  // The value, which is set with {{domxref("NavigationPreloadManager.setHeaderValue()")}}, can be used to inform a server that a different resource should be returned than in a normal `fetch()` operation.
}

export interface TransferCodingHeaders {
  /** Specifies the form of encoding used to safely transfer the resource to the user. */
  'Transfer-Encoding': string
  /** Specifies the transfer encodings the user agent is willing to accept. */
  TE: string
  /** Allows the sender to include additional fields at the end of chunked message. */
  Trailer: string
}

export interface WebSocketHeaders {
  /** TBD */
  'Sec-WebSocket-Key': string
  /** TBD */
  'Sec-WebSocket-Extensions': string
  /** TBD */
  'Sec-WebSocket-Accept': string
  /** TBD */
  'Sec-WebSocket-Protocol': string
  /** TBD */
  'Sec-WebSocket-Version': string
}
