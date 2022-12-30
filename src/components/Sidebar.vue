<template>
    <div class="px-4 py-3 fs-5" :style="impStyle" id="sidebar">
        <div class="mb-4 text-center pointer">
            <i class="fa-solid fa-user"></i>
        </div>

        <div class="d-flex flex-column justify-content-center gap-2">
            <div class="text-center pointer">
                <i class="fa-solid fa-plus"></i>
            </div>
            <div class="text-center" type="button" data-bs-toggle="collapse" data-bs-target="#color" aria-expanded="false" aria-controls="collapseExample">
                <i class="fa-sharp fa-solid fa-palette"></i>
            </div>
            <div class="collapse text-center" id="color">
                <div class="d-flex flex-column gap-1">
                    <slot name="colorSet">
                        <!--  -->
                    </slot>
                </div>
            </div>

            <div id="setting" class="text-center pointer">
                <i class="fa-solid fa-gear"></i>
            </div>
            <div class="text-center pointer">
                <i class="fa-solid fa-question"></i>
            </div>
        </div>

        <div class="mt-5 text-center pointer">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </div>
    </div>
</template>

<script setup>
let props = defineProps({
    impStyle: String
})
</script>