import React, { useState } from "react";
import { createActor } from "../../api/actor";
import { useNotification } from "../../hooks";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";
import {createDirector} from "../../api/director";

export default function DirectorUpload({ visible, onClose }) {
    const [busy, setBusy] = useState(false);

    const { updateNotification } = useNotification();

    const handleSubmit = async (data) => {
        setBusy(true);
        const { error, actor } = await createDirector(data);
        setBusy(false);
        if (error) return updateNotification("error", error);

        updateNotification("success", "Director created successfully.");
        onClose();
    };

    return (
        <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
            <ActorForm
                onSubmit={!busy ? handleSubmit : null}
                title="Create New Director"
                btnTitle="Create"
                busy={busy}
            />
        </ModalContainer>
    );
}
