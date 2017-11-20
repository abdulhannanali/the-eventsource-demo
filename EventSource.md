<!-- Section of information about EventSource API -->


## About EventSource API

[EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) provides a way to push realtime data from Server to the client using a protocol on top of HTTP/1.1 and above. One of the good part about EventSource API is unlike Web Sockets, it is not introducing any new underlying protocol and works on top of HTTP1 or it's successor HTTP/2 seemlessly with the help of some client side logic to parse the messages.

EventSource provides a reliable way to push unidirectional messages from Server to Client in realtime using a single HTTP connection, the API itself has been here for quite long although Internet Explorer and Edge does not support the EventSource API and we can expect the deprecation of this API in the future, with little or no developer interest in using it for realtime communication. 

#### At least better than polling

Polling was once one of the most widely used way to do realtime on the web, but it was inefficient and slow since it required many round trips and doing polling increased the server costs as well as latency in the system. In scenarios where server is the main message provider, EventSource provides a slick autoconnection management system built in browser natively and saves you the hassle of managing connections and reconnecting with the server. Once the connection is established, it takes no more roundtrips to get the data from the server, and a few techniques can be used to sustain the connection for longer periods of time.

Jake Archibald does think it has it's own place in the Web

> @annevk is EventSource being deprecated? I thought its auto-reconnection stuff made it a nice high-level API? I agree it isn't useful in a service worker though. - [Jake Archibald's Comment](https://github.com/w3c/ServiceWorker/issues/947#issuecomment-290579201)

#### State of Browser support for EventSource

EventSource is definitely not the priority for new browsers when it comes to a unidirectional push standard. Internet explorer does not implement it and Edge seems to have [no plans](https://github.com/w3c/ServiceWorker/issues/947#issuecomment-255626995) to inroduce it within it's own browser. Unlike WebSockets, [EventSource](https://github.com/w3c/ServiceWorker/issues/947) is not exposed in Service Workers too, you are better off thinking about **HTTP/2, WebSockets, WebRTC** for your realtime communication logic. 

#### Text only protocol

EventSource is good for textual communication only and falls it's mark when it comes to binary
data, because of the nature of protocol, and rules governing the communication and appropriate parsing. Meanwhile, WebSockets allow you to do binary communication efficiently using the Blob API in browsers which provides an abstraction over the binray data, speeding things up for the client. 