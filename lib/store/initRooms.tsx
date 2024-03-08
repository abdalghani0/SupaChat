"use client";
import React, { useEffect, useRef } from 'react';
import { room, useRooms } from './rooms';
import { LIMIT_MESSAGE } from '../constants/idex';

function InitRooms({rooms} : { rooms: room[]}) {
    const initState = useRef(false);
    const { currentRoomMessages } = useRooms();
    const hasMore = currentRoomMessages.length >= LIMIT_MESSAGE;
    console.log("length" + currentRoomMessages.length)

    useEffect(() => {
        if(!initState.current) {
            useRooms.setState({ rooms, hasMore });
        }
        initState.current = true;
    },[])

    return <></>
}

export default InitRooms;