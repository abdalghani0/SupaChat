"use client";

import React, { useEffect, useRef } from 'react';
import { room, useRooms } from './rooms';

function InitRooms({rooms} : { rooms: room[]}) {
    const initState = useRef(false);

    useEffect(() => {
        if(!initState.current) {
            useRooms.setState({ rooms });
        }
        initState.current = true;
    },[])

    return <></>
}

export default InitRooms;