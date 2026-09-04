'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  Alignment,
  Bold,
  ClassicEditor,
  Essentials,
  Italic,
  List,
  Paragraph,
  type EditorConfig,
} from 'ckeditor5';
import { Control, Controller, FieldValues } from 'react-hook-form';
import 'ckeditor5/ckeditor5.css';
import styles from './textEditor.module.scss';

interface TextEditorProps {
  control: Control<FieldValues>;
  name: string;
  label: string;
}

const editorConfig: EditorConfig = {
  licenseKey: 'GPL',
  plugins: [Essentials, Paragraph, Bold, Italic, Alignment, List],
  toolbar: ['bold', 'italic', 'alignment', 'bulletedList', 'numberedList'],
};

const TextEditor = ({ control, name, label }: TextEditorProps) => (
  <section className={styles['text-editor-component']}>
    <div className={styles['text-editor-labels']}>
      <label className={styles['text-editor-label']}>
        {label} <span>*</span>
      </label>
      <label className={styles['text-editor-sub-label']}>
        Describe the job in a good, easy-to-read format. Description is the key to
        encourage more applicants
      </label>
    </div>
    <Controller
      name={name}
      control={control}
      rules={{ required: 'This field is required' }}
      defaultValue=""
      render={({ field, fieldState }) => (
        <>
          <CKEditor
            editor={ClassicEditor}
            config={editorConfig}
            data={field.value ?? ''}
            onChange={(_event, editor) => {
              field.onChange(editor.getData());
            }}
          />
          {fieldState.error && (
            <p className="error-message">{fieldState.error.message}</p>
          )}
        </>
      )}
    />
  </section>
);

export default TextEditor;
