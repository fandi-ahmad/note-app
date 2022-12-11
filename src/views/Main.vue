<template>
    <div class="container-fluid p-0">
        <div class="d-flex flex-row justify-content-between h-100vh">
            <Sidebar />
            <!-- note area -->
            <div id="noteArea" class="px-4 pt-3 d-none transition" style="width: 0%;">
                <div class="d-flex flex-column align-items-between h-100">
                    <div class="d-flex justify-content-between align-items-center mb-2 gap-2">
                        <input id="inputTitle" v-model="noteAdd.title" type="text" placeholder="title here" class="fs-4 w-100 border-0-fix">
                        <button @click="cancel" class="btn btn-sm btn-danger">cancel</button>
                        <button @click="save" class="btn btn-sm btn-primary">save</button>
                    </div>
                    <input id="inputDate" v-model="noteAdd.create_at" type="date">
                    <textarea id="inputNote" v-model="noteAdd.note" class="w-100 h-100 edit-area" placeholder="type something"></textarea>
                </div>
            </div>
            
            <!-- list note -->
            <div id="noteList" class="px-3 pt-3 h-100 bg-primary transition note-list" style="width: 100%;">
                <BaseSearch />
                <div class="w-100 py-2">

                    <div v-for="(noteData, index) in noteData" :key="index" class="bg-light rounded rounded-2 p-2 my-2 d-flex justify-content-between">
                        <div >
                            <div class="fw-bold">{{ noteData.title }}</div>
                            <div>{{ noteData.note }}</div>
                            <small>{{ noteData.create_at }}</small>
                        </div>
                        <div>
                            <div @click="editNote(noteData.id)">
                                <i class="fa-solid fa-pen text-primary pointer"></i>
                            </div>
                            <div @click="deleteNote(noteData.id)">
                                <i class="fa-solid fa-trash text-danger pointer"></i>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
import BaseSearch from '../components/BaseSearch.vue'

import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'
import axios from 'axios';

// get data from database
let noteData = ref([])
const getData = () => {
    axios.get('http://localhost:3000/data')
   .then((res) => {
       noteData.value = res.data
    }).catch((err) => {
        alert('something error')
    })
}

// data storage for send to database
const noteAdd = reactive({
    id: '',
    title: '',
    note: '',
    create_at: ''
})

// clear data in form input
const clearData = () => {
    noteAdd.id = ''
    noteAdd.title = ''
    noteAdd.note = ''
    noteAdd.create_at = ''
}

const rules = computed(() => {
    return{
        title: {required},
        note: {required},
        create_at: {required},
    }
})

// VALIDATE 
const v$ = useVuelidate(rules, noteAdd)

// save "create/update"
const save = async () => {
    const res = await v$.value.$validate()
    if (noteAdd.id.length >= 0) {
        if (res) {
            axios.post('http://localhost:3000/data', noteAdd)
            .then((result) => {
                alert('save success')
                getData()
                clearData()
            }).catch((err) => {
                alert('masih belumm :(')
            });
        } else {
            alert('data tidak boleh kosong')
        }
    } else {
        if (res) {
            axios.put(`http://localhost:3000/data/${noteAdd.id}`, noteAdd)
            .then((result) => {
                alert('save success')
                getData()
                clearData()
            }).catch((err) => {
                alert('masih belumm :(')
            });
        } else {
            alert('data tidak boleh kosong')
        }
    }
}

const cancel = () => {
    clearData()
    closeNote()
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

let noteDataEdit = ref([])
// edit note
const editNote = (params) => {
    openNote()
    getData()
    noteAdd.id = params
    axios.get(`http://localhost:3000/data/${params}`)
    .then((result) => {
        noteDataEdit = result.data
        
        noteAdd.title = noteDataEdit.title
        noteAdd.note = noteDataEdit.note
        noteAdd.create_at = noteDataEdit.create_at

        inputTitle.value.value = noteDataEdit.title
        inputNote.value.value = noteDataEdit.note
        inputDate.value.value = noteDataEdit.create_at
        getData()
    }).catch((err) => {
        console.log(err)
    });
}

// delete note
const deleteNote = (params) => {
    axios.delete(`http://localhost:3000/data/${params}`)
    .then((result) => {
        getData()
    }).catch((err) => {
        console.log(err)
    });
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

    const newNote = document.getElementById('newNote')
    newNote.addEventListener('click', function() {
        openNote()
    })

    inputTitle.value = document.getElementById('inputTitle')
    inputDate.value = document.getElementById('inputDate')
    inputNote.value = document.getElementById('inputNote')

    const setting = document.getElementById('setting')
    // for check data and show in console log
    setting.addEventListener('click', function() {
        console.log(noteAdd)
    })
})

</script>