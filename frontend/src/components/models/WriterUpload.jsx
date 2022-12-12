import React, { useState } from "react";
import { useNotification } from "../../hooks";
import ActorForm from "../form/ActorForm";
import ModalContainer from "./ModalContainer";
import {createWriter} from "../../api/writer";

export default function WriterUpload({ visible, onClose }) {
    const [busy, setBusy] = useState(false);

    const { updateNotification } = useNotification();

    const handleSubmit = async (data) => {
        setBusy(true);
        const { error, actor } = await createWriter(data);
        setBusy(false);
        if (error) return updateNotification("error", error);

        updateNotification("success", "Writer created successfully.");
        onClose();
    };

    return (
        <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
            <ActorForm
                onSubmit={!busy ? handleSubmit : null}
                title="Create New Writer"
                btnTitle="Create"
                busy={busy}
            />
        </ModalContainer>
    );
}
