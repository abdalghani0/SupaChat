"use client";
import React, { useEffect, useRef } from 'react';
import { Imessage, useMessage } from './messages';
import { LIMIT_MESSAGE } from '../constants/idex';

function InitMessages({messages} : {  messages: Imessage[] }) {
    const initState = useRef(false);
    const hasMore = messages.length >= LIMIT_MESSAGE;

    useEffect(() => {
        if(!initState.current) {
            useMessage.setState({ messages, hasMore });
        }
        initState.current = true;
    },[])

    return <></>
}

export default InitMessages;