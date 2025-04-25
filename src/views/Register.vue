<script setup lang="ts">
    import { EXTERNAL_USER_REGISTRATION_ONLY_NOTICE } from '@/cookies';
    import getCookie from '@/func/getCookie';
    import getCountries from '@/func/getCountries';
    import getStorage from '@/func/getStorage';
    import setCookie from '@/func/setCookie';
    import setStorage from '@/func/setStorage';
    import useStorage from '@/func/useStorage';
    import router from '@/router';
    import { Select, Banner, Box, Card, Form, FormLayout, Layout, LayoutAnnotatedSection, LayoutSection, Page, TextField, InlineGrid } from '@ownego/polaris-vue';
    import { ref, watch } from 'vue';

    const externalUserRegistrationOnlyNoticeEnabled = ref(getCookie(EXTERNAL_USER_REGISTRATION_ONLY_NOTICE, 'true'));

    watch(externalUserRegistrationOnlyNoticeEnabled, v => {
        setCookie(EXTERNAL_USER_REGISTRATION_ONLY_NOTICE, v);
    });

    const localMark = useStorage('register-draft-saved', 'false');

    const username = ref('');
    const password = ref('');
    const email = ref('');
    const region = ref('');
    const age = ref('');
    const gender = ref('');

    if (localMark.value === 'true') {
        username.value = draftGet('username');
        password.value = draftGet('password');
        email.value = draftGet('email');
        region.value = draftGet('region');
        gender.value = draftGet('gender');
        age.value = draftGet('age');
    }

    const countryOptions = getCountries('zh');
    const genderOptions = [
        {
            label: '男',
            value: 'M'
        },
        {
            label: '女',
            value: 'F'
        },
        {
            label: '其它',
            value: 'O'
        },
        {
            label: '不透露',
            value: 'U'
        }
    ]

    function submit() {

    }

    function draftSave(name: string, value: string) {
        setStorage(`register-draft-${name}`, value);
    }

    function draftGet(name: string) {
        return getStorage(`register-draft-${name}`);
    }

    function saveDraft() {
        draftSave('username', username.value);
        draftSave('password', password.value);
        draftSave('email', email.value);
        draftSave('region', region.value);
        draftSave('gender', gender.value);
        draftSave('age', age.value);
        draftSave('saved', 'true');
        alert('草稿存储成功');
    }

    function clearDraft() {
        draftSave('saved', 'false');
        alert('草稿已清除');
    }
</script>

<template>
    <Page title="注册用户" :back-action="{ onAction: () => router.go(-1) }"
        :primary-action="{ content: '提交', onAction: submit }" :secondary-actions="[{
            content: '存储草稿',
            onAction: saveDraft
        }, {
            content: '清除草稿',
            onAction: clearDraft
        }]">
        <Layout>
            <LayoutSection v-if="externalUserRegistrationOnlyNoticeEnabled === 'true'">
                <Banner tone="info" title="本页面为外部用户注册页" @dismiss="() => {
                    externalUserRegistrationOnlyNoticeEnabled = 'false'
                }">
                    <p>如需创建 Monologue 管理用户，请联系管理员在后台创建专用用户，并授予正确的权限。</p>
                </Banner>
            </LayoutSection>
            <LayoutAnnotatedSection title="注册信息"
                description="通过注册 Monologue，你可以持续管理自己的数据，并以一致的身份参与到收集中。信息填写完毕后，单击右上角的“提交”完成注册。">
                <Card>
                    <Box padding-block-end="200">
                        <Form no-validate>
                            <FormLayout>
                                <TextField v-model="username" label="用户名" help-text="你的唯一标识，请谨慎填写"
                                    placeholder="由字母、数字、下划线组成" :max-length="20" show-character-count auto-complete="off"
                                    required-indicator />
                                <TextField v-model="password" label="密码" help-text="请使用健壮、未泄露的密码，以免身份盗用"
                                    placeholder="需至少 8 位" auto-complete="off" required-indicator />

                                <InlineGrid columns="1fr 1fr" gap="400">
                                    <Select label="性别" :options="genderOptions" v-model="gender" />
                                    <TextField v-model="age" label="年龄" type="number" steps="1" min="0" max="120" auto-complete="off"/>
                                </InlineGrid>
                                <Select label="国家/地区" :options="countryOptions" v-model="region" />
                            </FormLayout>
                        </Form>
                    </Box>
                </Card>
            </LayoutAnnotatedSection>
        </Layout>
    </Page>
</template>