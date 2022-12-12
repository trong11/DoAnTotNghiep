import React, { useState } from "react";
import { useNotification } from "../../hooks";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";
import {updateWriter} from "../../api/writer";

export default function UpdateWriter({
                                           visible,
                                           initialState,
                                           onSuccess,
                                           onClose,
                                       }) {
    const [busy, setBusy] = useState(false);

    const { updateNotification } = useNotification();

    const handleSubmit = async (data) => {
        setBusy(true);
        const { error, writer } = await updateWriter(initialState.id, data);
        setBusy(false);
        if (error) return updateNotification("error", error);
        onSuccess(writer);
        updateNotification("success", "Writer updated successfully.");
        onClose();
    };

    return (
        <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
            <ActorForm
                onSubmit={!busy ? handleSubmit : null}
                title="Update Writer"
                btnTitle="Update"
                busy={busy}
                initialState={initialState}
            />
        </ModalContainer>
    );
}
