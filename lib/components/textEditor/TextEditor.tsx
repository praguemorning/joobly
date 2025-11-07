'use client'
import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { Control, Controller } from 'react-hook-form';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import styles from "./textEditor.module.scss";


interface TextEditorProps {
  control: Control<any>;
  name: string;
  label: string
}

const TextEditor = ({ control, name, label }: TextEditorProps) => (
  <section className={styles["text-editor-component"]}>
    <div className={styles["text-editor-labels"]}>
      <label className={styles["text-editor-label"]}>{label} <span>*</span></label>
      <label className={styles["text-editor-sub-label"]}>Describe the job in a good, easy-to-read format. Description is the key to encourage more applicants</label>
    </div>
    <Controller
      name={name}
      control={control}
      rules={{ required: 'This field is required' }}
      defaultValue=""
      render={({ field, fieldState }) => (
        <>
          <CKEditor
            editor={DecoupledEditor as any}
            config={{
              toolbar: ['bold', 'italic', 'alignment', 'bulletedList', 'numberedList'],
              removePlugins: ['ListProperties'],
            }}
            data={field.value}
            onChange={(event, editor) => {
              const data = editor.getData();
              field.onChange(data);
            }}
            onReady={(editor) => {
              editor.ui
                ?.getEditableElement()?.parentElement?.insertBefore(
                  editor.ui.view.toolbar!.element!,
                  editor.ui.getEditableElement()!
                );
            }}
          />
          {fieldState.error && <p className={"error-message"}>{fieldState.error.message}</p>}
        </>
      )}
    />

  </section>
);

export default TextEditor;