<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import { de, fa, ro } from "element-plus/es/locale";
import { a } from "@tauri-apps/api/app-373d24a3";
import { ElMessage } from "element-plus";
import { appWindow } from '@tauri-apps/api/window'
import { ExtensionMenu } from "../../extension_menu";

const tableData = ref<ExtensionMenu[]>([])

// 是否是编辑状态
const editStatus = ref(false)
const editFormTitle = ref("")
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const editFormData = ref<ExtensionMenu>()
editFormData.value = {
    id: 0,
    name: "",
    url: "",
    priority: 0
};
const deleteId = ref(-1)

const editFormRules = {
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' }
    ],
    url: [
        { required: true, message: '请输入链接', trigger: 'blur' }
    ]
}

onMounted(() => {
    initData();
})

async function initData() {
    // 拉取设置列表
    let menuList = await invoke('query_extension_menus_handler') as ExtensionMenu[]
    tableData.value = menuList;
}

function remove(row: ExtensionMenu) {
    // 删除操作逻辑
    deleteDialogVisible.value = true;
    deleteId.value = row.id;
}
async function handleConfirmDelete() {
    let result = await invoke('delete_extension_menu_item_handler', { id: deleteId.value })
    if (result) {
        ElMessage.success("删除平台成功！");
        deleteDialogVisible.value = false;
        initData();
    } else {
        ElMessage.error("未知错误, 删除平台失败!!");
    }
}

function edit(row: ExtensionMenu) {
    editStatus.value = true;
    editFormTitle.value = "编辑";
    dialogVisible.value = true;
    editFormData.value = {
        id: row.id,
        url: row.url,
        name: row.name,
        priority: row.priority
    };
}

function add() {
    editStatus.value = false;
    editFormTitle.value = "新增平台";
    dialogVisible.value = true;
    editFormData.value = {
        id: 0,
        url: "",
        name: "",
        priority: 0
    };

    appWindow.emit('test_event', { message: 'tttttttt' });

}

function onSort() {

}

function cancel() {
    dialogVisible.value = false;
}

async function confirm() {
    // console.log(editFormData);
    if (editFormData.value!.name.trim() == ''
        || editFormData.value!.url.trim() == '') {
        return;
    }
    console.log("-------------" + editStatus.value);
    if (editStatus.value) {
        let priority = 0;
        if (editFormData.value!.priority == null || editFormData.value!.priority == undefined) {
            priority = 0;
        } else {
            priority = editFormData.value!.priority;
        }
        let result = await invoke('edit_extension_menu_item_handler', {
            id: editFormData.value!.id,
            name: editFormData.value!.name,
            url: editFormData.value!.url,
            priority: priority
        }) as boolean;
        if (result) {
            ElMessage.success("更新平台成功！");
            dialogVisible.value = false;
            initData();
        } else {
            ElMessage.error("未知错误, 更新平台失败!!");
        }
    } else {
        let priority = 0;
        let result = await invoke('add_extension_menu_item_handler', {
            name: editFormData.value!.name,
            url: editFormData.value!.url,
            priority: priority
        }) as boolean;
        if (result) {
            ElMessage.success("新增平台成功！");
            dialogVisible.value = false;
            initData();
        } else {
            ElMessage.error("未知错误, 新增平台失败!!");
        }
    }
}
</script>

<template>
    <div>
        <span class="set-subtitle common-margin-top-8">注：新增或者删除自定义平台需在重启应用后生效。</span>
        <el-table :data="tableData" v-sortable:columns.move="onSort" style="height: 470px;">
            <!-- <el-table-column prop="id" label="ID" width="40px"></el-table-column> -->
            <el-table-column prop="name" label="名称" width="110px"></el-table-column>
            <el-table-column prop="url" label="链接地址"></el-table-column>
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button type="primary" size="mini" @click="edit(row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-container">
            <el-button class="add-button" type="primary" @click="add"><el-icon>
                    <plus />
                </el-icon></el-button>
        </div>
        <el-dialog v-model="dialogVisible" v-model:title="editFormTitle" draggable="true">
            <el-form :model="editFormData" :rules="editFormRules" ref="form">
                <el-form-item label="名称" prop="name">
                    <el-input maxlength="15" show-word-limit style="box-shadow: 0;" v-model="editFormData!.name"
                        placeholder="请输入名称"></el-input>
                </el-form-item>
                <el-form-item label="链接" prop="url">
                    <el-input v-model="editFormData!.url" placeholder="请输入链接,如: https://xxx.com"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="cancel">取消</el-button>
                <el-button type="primary" @click.native="confirm">确定</el-button>
            </div>
        </el-dialog>
        <!-- 二次删除确认框 -->
        <el-dialog title="确认删除" v-model="deleteDialogVisible" width="50%" draggable="true">
            <span style="color: black;">删除后将不可恢复，确定要删除吗？</span>
            <div style="margin-top: 36px;" slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取消</el-button>
                <el-button type="danger" @click="handleConfirmDelete">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<style scoped>
/* .page-container {
    position: relative;
    height: 100%;
} */

.add-button {
    text-align: center;
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 20px;
    line-height: 50px;
    z-index: 999
}

.dialog-footer {
    flex: 1;
    display: flex;
    justify-content: end;
}

.el-input__inner {
    box-shadow: none;
}
</style>
