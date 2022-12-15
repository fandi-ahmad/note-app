<template>
    <div>
        <CKEditor :editor="ClassicEditor" v-model="editorData" :config="editorConfig" id="inputNote" />
    </div>
</template>

<script setup>
import { component as CKEditor } from '@ckeditor/ckeditor5-vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ref, watch } from 'vue';

const props = defineProps({
    modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const editorData = ref(props.modelValue || '')
const editorConfig = ref({
    toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ],
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
        ]
    }
})

watch(editorData, () => {
    emit('update:modelValue', editorData.value)
})
</script>