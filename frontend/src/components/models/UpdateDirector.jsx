import React, { useState } from "react";
import { updateActor } from "../../api/actor";
import { useNotification } from "../../hooks";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";
import {updateDirector} from "../../api/director";

export default function UpdateDirector({
                                        visible,
                                        initialState,
                                        onSuccess,
                                        onClose,
                                    }) {
    const [busy, setBusy] = useState(false);

    const { updateNotification } = useNotification();

    const handleSubmit = async (data) => {
        setBusy(true);
        const { error, director } = await updateDirector(initialState.id, data);
        setBusy(false);
        if (error) return updateNotification("error", error);
        onSuccess(director);
        updateNotification("success", "Director updated successfully.");
        onClose();
    };

    return (
        <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
            <ActorForm
                onSubmit={!busy ? handleSubmit : null}
                title="Update Director"
                btnTitle="Update"
                busy={busy}
                initialState={initialState}
            />
        </ModalContainer>
    );
}
