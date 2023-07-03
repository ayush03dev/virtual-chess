import React, { ChangeEvent, MouseEvent, useState } from "react";
import Referee from "../Referee/Referee";
import { v4 } from "uuid";
import "./Home.css";

export default function Home() {
    const [name, setName] = useState<string | null>(null);
    const [nameField, setNameField] = useState<string | null>(null);
    const [existing, setExisting] = useState<boolean>(false);
    const [redirect, setRedirect] = useState<boolean>(false);
    const [uuid, setUuid] = useState<string | null>(null);
    const [uuidField, setUuidField] = useState<string | null>(null);

    function onChange(event: ChangeEvent<HTMLInputElement>) {
        setNameField(event.target.value);
    }

    function onChangeUuid(event: ChangeEvent<HTMLInputElement>) {
        setUuidField(event.target.value);
    }

    function onClick(event: MouseEvent<HTMLButtonElement>) {
        setName(nameField);
    }

    function onCreateLink(event: MouseEvent<HTMLButtonElement>) {
        const uuid: string = v4().split("-")[0];
        setUuid(uuid);
        setRedirect(true);
    }

    function onEnter(event: MouseEvent<HTMLButtonElement>) {
        setUuid(uuidField);
        setRedirect(true);
        setExisting(true);
    }

    if (redirect && uuid && name) {
        return <Referee uuid={uuid} createInvite={!existing} username={name} />
    }

    if (!name) {
        return (
            <div style={{ padding: "4rem" }}>
                <h1 className="heading">Virtual Chess</h1>
                <br /><br />
                <div className="home">
                    <h2 className="title">Enter a username</h2>
                    <input className="field" onChange={onChange} type="text" name="uname" autoComplete="off" /><br /><br />
                    <button onClick={onClick}>Submit</button>
                </div>
            </div>
        )
    } else {
        return (
            <div style={{ padding: "4rem" }}>
                <h1 className="heading">Virtual Chess</h1>
                <br /><br />
                <div className="home">
                    <h2>Welcome, <span style={{ color: "#ff79c6" }}>{name}</span></h2><br />
                    <h3 className="title">Join by Invite ID</h3>
                    <input className="field" onChange={onChangeUuid} type="text" name="inviteId" autoComplete="off" /> <br /><br />
                    <button onClick={onEnter}>Enter Invite Id</button><br />
                    <br />
                    <h2 className="title">Or</h2>

                    <button onClick={onCreateLink}>Create a new Invite</button>
                </div>
                <div>
                </div>
            </div>
        )
    }

}