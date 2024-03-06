"use client";

import React, { useEffect, useRef } from 'react';
import { IUser, useUsers } from './users';

function InitUsers({users} : { users: IUser[]}) {
    const initState = useRef(false);

    useEffect(() => {
        if(!initState.current) {
            useUsers.setState({ users });
        }
        initState.current = true;
    },[])

    return <></>
}

export default InitUsers;