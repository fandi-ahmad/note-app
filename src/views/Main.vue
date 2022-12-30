<template>
    <div class="container-fluid p-0">
        <div class="d-flex flex-row justify-content-between h-100vh">
            <Sidebar impStyle="background-color: var(--soft-blue);">
                <template v-slot:colorSet>
                    <input type="color" class="pointer input-color" v-model="v.color" id="colorId">
                    <input type="color" class="pointer input-color" v-model="v.colorSecond" id="colorSecond">
                    <input type="color" class="pointer input-color" v-model="v.colorBoard" id="colorBoard">
                </template>
            </Sidebar>
            <!-- note area -->
            <div id="noteArea" class="px-4 pt-3 d-none transition" style="width: 0%; background-color: #ffffff;">
                <div class="d-flex flex-column align-items-between h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2 gap-2">
                        <input id="inputTitle" v-model="noteAdd.title" type="text" placeholder="title here" class="fs-4 w-100 border-0-fix bg-transparent">
                        <button id="saveBtn" @click="save" class="btn btn-sm text-white p-0 text-center" style="background-color: var(--hard-blue); overflow: hidden; width: 75px; height: 30px;">
                            <span class="btn-hover">save</span>
                        </button>
                    </div>
                    <textarea id="inputNote" v-model="noteAdd.note" class="w-100 h-100 edit-area bg-transparent" placeholder="type something"></textarea>
                </div>
            </div>
            
            <!-- list note -->
            <div id="noteList" class="transition" style="width: 100%; ">
                <div class="px-3 pt-3 h-100 overflow" id="noteListBoard" style="background-color: var(--soft-blue); border-left: 3px solid var(--hard-blue);">
                    <div class="w-100 py-2">
                        <BaseSearch />
                        <div class="note-list pt-2">
                            <div v-for="noteData in noteData" :key="noteData.id" class="rounded rounded-2 p-2 note-card">
                                <div @click="editNote(noteData.id, noteData.title, noteData.note)" class="pointer w-100">
                                    <div class="fw-bold">{{ noteData.title }}</div>
                                    <div>{{ noteData.note }}</div>
                                    <small>{{ noteData.updated_at }}</small>
                                </div>
                                <div>
                                    <div @click="deleteNote(noteData.id)">
                                        <i class="fa-solid fa-trash text-danger pointer"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="newNoteIcon" @click="newNote" class="my-round fs-5 text-white pointer" style="background-color: var(--hard-blue);">
                    <i :class="v.noteClass" class="fa-solid"></i>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import BaseSearch from '../components/BaseSearch.vue'
import ContentEditor from '../components/ContentEditor.vue';

import { ref, onMounted, reactive, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import Alert from '../assets/sweetAlert.js'

import NoteApp from '../api/NoteApp.js'

// binding for open and close note
const v = reactive({
    bit: 0,
    noteClass: 'fa-plus',
    error: 'Something wrong!',
    search: '',
    color: '#B5DEFF',
    colorSecond: '#18a3ca',
    colorBoard: '#ffffff'
})

// get data from database
let noteData = ref([])
const getData = () => {
    NoteApp.get_list()
    .then((res) => {
        noteData.value = res.data
        noteData.value = noteData.value.data
    }).catch((err) => {
        Alert.alertError(v.error)
    })
}

// data storage for send to database
const noteAdd = reactive({
    id: '',
    title: '',
    note: '',
})

// clear data in form input
const clearData = () => {
    noteAdd.id = ''
    noteAdd.title = ''
    noteAdd.note = ''
}

const rules = computed(() => {
    return{
        title: {required},
        note: {required},
    }
})

// VALIDATE 
const v$ = useVuelidate(rules, noteAdd)

// save "create/update"
const save = async () => {
    const res = await v$.value.$validate()
    if (noteAdd.id.length >= 0) {
        if (res) {
            NoteApp.upsert(noteAdd)
            .then((result) => {
                Alert.alertSuccess('success')
                getData()
                clearData()
            }).catch((err) => {
                Alert.alertError(v.error)
            });
        } else {
            Alert.alertError('Data is required')
        }
    } else {
        if (res) {
            NoteApp.update(noteAdd.id, noteAdd)
            .then((result) => {
                Alert.alertSuccess('success')
                getData()
                clearData()
            }).catch((err) => {
                Alert.alertError(v.error)
            });
        } else {
            Alert.alertError('Data is required')
        }
    }
}

// close note area
const closeNote = () => {
    noteArea.value.classList.add('d-none')
    noteArea.value.style.width = '0'
    noteList.value.style.width = '100%'
    noteList.value.style.minWidth = '0'
}

// open note area
const openNote = () => {
    noteArea.value.style.width = '100%'
    noteList.value.style.width = '250px'
    noteList.value.style.minWidth = '250px'
    setTimeout(() => {
        noteArea.value.classList.remove('d-none')
    }, 500);
}

// edit note
const editNote = (id, title, note) => {
    if (v.bit != 1) {
        openNote()
        v.bit = 1
        v.noteClass = 'fa-chevron-left'
    }
    getData()
    noteAdd.id = id
    noteAdd.title = title
    noteAdd.note = note
}

// delete note
const deleteNote = (params) => {
    Alert.alertConfirm({
        title: 'Delete?',
        confirmtext: 'Yes, Deleted it'
    })
    .then((result) => {
        if (result.isConfirmed) {
            NoteApp.delete(params)
            .then((result) => {
                getData()
                clearData()
                Alert.alertSuccess('success')
            }).catch((err) => {
                Alert.alertError(v.error)
            });
        }
    })
}

const newNote = () => {
    if (v.bit < 1) {
        v.bit++
        v.noteClass = 'fa-chevron-left'
        openNote()
        return
    }
    if (v.bit >= 1) {
        v.bit--
        v.noteClass = 'fa-plus'
        closeNote()
        clearData()
    }
}

// DOM components
const noteArea = ref(null);
const noteList = ref(null);
const inputTitle = ref(null)
const inputDate = ref(null)
const inputNote = ref(null)

onMounted(() => {
    getData()

    noteArea.value = document.getElementById('noteArea')
    noteList.value = document.getElementById('noteList')

    inputTitle.value = document.getElementById('inputTitle')
    inputDate.value = document.getElementById('inputDate')
    inputNote.value = document.getElementById('inputNote')
    
    const colorId = document.getElementById('colorId')
    const sidebar = document.getElementById('sidebar')
    const noteListBoard = document.getElementById('noteListBoard')
    const colorSecond = document.getElementById('colorSecond')
    const newNoteIcon = document.getElementById('newNoteIcon')
    const saveBtn = document.getElementById('saveBtn')
    const colorBoard = document.getElementById('colorBoard')
    const noteAreaN = document.getElementById('noteArea')
    
    colorId.addEventListener('input', function() {
        let colorValue = colorId.value
        sidebar.style.backgroundColor = colorValue
        noteListBoard.style.backgroundColor = colorValue
    })

    colorSecond.addEventListener('input', function() {
        let colorSecondValue = colorSecond.value
        noteListBoard.style.borderLeft = '3px solid' + colorSecondValue
        newNoteIcon.style.backgroundColor = colorSecondValue
        saveBtn.style.backgroundColor = colorSecondValue
    })

    colorBoard.addEventListener('input', function() {
        noteAreaN.classList.remove('transition')
        noteAreaN.style.backgroundColor = colorBoard.value
    })

})

</script>