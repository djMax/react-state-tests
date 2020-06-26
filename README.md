react-state-tests
=================

State management in React(-native) is hard. Maybe it's just me. But I don't
think it is. The standard ToDo List example is deceptively simple. I want a more
realistic example, based on a problem I encountered building an app. The setup is
we have a flow:

1) A UUID must be generated (this is an async operation)
2) User location must be obtained (this is an async operation)
3) A network call to "create a session" must be made, and it requires the UUID and the location
4) That network call STREAMS results back, and the individual messages must update other state items as they arrive.

unstated-next
-------------
I love the simplicity of unstated-next. Currently this is the only one that works/exists. The approach is a container for each part: UuidContainer, LocationContainer, SessionContainer and ThingContainer. The first three have a "load status" variable. Session container uses the state of the other dependent containers to kick off the network request. But if the useEffect function runs AGAIN while waiting, we have to make sure not to make the request again, so we useRef a promise.

Pros:
 * It works
Cons:
 * I don't like all the containers at the top level. If you want small containers, you'll end up with a crapton of them. And I assume (?) order matters - you have to make sure dependent containers are lower in the chain.
 * Encoding these dependencies is pretty verbose. I SMELL some sort of helper functions, but I don't see them yet.
