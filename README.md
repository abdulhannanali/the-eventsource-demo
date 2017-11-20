# The EventSource API

<!-- Table containing a few important links -->
<table>
    <tr>
        <td><h3><a href="https://the-eventsource-demo-lacfhxlpdm.now.sh/">Show me the demo</a></h3></td>
        <td><h3><a href="https://html.spec.whatwg.org/multipage/server-sent-events.html">Read the Spec</a></h3></td>
        <td><h3><a href="https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events">Read <b>MDN</b> Article on Server Sent Events</a></h3></td>
    </tr>
</table>
<!-- End table -->

![ISS Map Screenshot from the Demo](./.github/readme-assets/map-shot.png)

## About EventSource API

[EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) provides a way to push realtime data from Server to the client using a protocol on top of HTTP/1.1 and above. One of the good part about EventSource API is unlike Web Sockets, it is not introducing any new underlying protocol and works on top of HTTP1 or it's successor HTTP/2 seemlessly with the help of some client side logic to parse the messages.

EventSource provides a reliable way to push unidirectional messages from Server to Client in realtime using a single HTTP connection, the API itself has been here for quite long although Internet Explorer and Edge does not support the EventSource API and we can expect the deprecation of this API in the future, with little or no developer interest in using it for realtime communication. 

### At least better than polling

Polling was once one of the most widely used way to do realtime on the web, but it was inefficient and slow since it required many round trips and doing polling increased the server costs as well as latency in the system. In scenarios where server is the main message provider, EventSource provides a slick autoconnection management system built in browser natively and saves you the hassle of managing connections and reconnecting with the server. 

Jake Archibald does think it has it's own place in the Web

> @annevk is EventSource being deprecated? I thought its auto-reconnection stuff made it a nice high-level API? I agree it isn't useful in a service worker though. - [Jake Archibald's Comment](https://github.com/w3c/ServiceWorker/issues/947#issuecomment-290579201)

### State of Browser support for EventSource

EventSource is definitely not the priority for new browsers when it comes to a unidirectional push standard. Internet explorer does not implement it and Edge seems to have [no plans](https://github.com/w3c/ServiceWorker/issues/947#issuecomment-255626995) to inroduce it within it's own browser. Unlike WebSockets, [EventSource](https://github.com/w3c/ServiceWorker/issues/947) is not exposed in Service Workers too, you are better off thinking about **HTTP/2, WebSockets, WebRTC** for your realtime communication logic. As these newer technologies are well thought approach for realtime and have a wider developer community by now.

## Contributing

Contributions are more than welcome, please check out **Issues** for some of the tasks
that can be improved upon.

## License

The source code for the demo is licensed under MIT LICENSE. See [LICENSE](LICENSE)
for more details.