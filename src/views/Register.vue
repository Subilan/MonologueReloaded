<script setup lang="ts">
    import PopBanner from '@/components/PopBanner.vue';
    import { RegexUtil } from '@/consts';
    import { EXTERNAL_USER_REGISTRATION_ONLY_NOTICE } from '@/cookies';
    import getCookie from '@/func/getCookie';
    import getCountries from '@/func/getCountries';
    import getStorage from '@/func/getStorage';
    import { RequestErrors } from '@/func/requests/consts';
    import createUser from '@/func/requests/create-user';
    import setCookie from '@/func/setCookie';
    import setStorage from '@/func/setStorage';
    import type { Model } from '@/models/basic';
    import router from '@/router';
    import { Select, Banner, Box, Card, Form, FormLayout, Layout, LayoutAnnotatedSection, LayoutSection, Page, TextField, InlineGrid } from '@ownego/polaris-vue';
    import { ref, useTemplateRef, watch } from 'vue';
    import { useI18n } from 'vue-i18n';

    const i18n = useI18n();

    const externalUserRegistrationOnlyNoticeEnabled = ref(getCookie(EXTERNAL_USER_REGISTRATION_ONLY_NOTICE, 'true'));

    watch(externalUserRegistrationOnlyNoticeEnabled, v => {
        setCookie(EXTERNAL_USER_REGISTRATION_ONLY_NOTICE, v);
    });

    const username = ref('');
    const password = ref('');
    const email = ref('');
    const region = ref('Andorra');
    const age = ref('');
    const gender = ref('M');
    const passwordConfirm = ref('');

    const ui__usernameError = ref('');
    const ui__passwordError = ref('');
    const ui__ageError = ref('');
    const ui__passwordConfirmError = ref('');

    const ui__submitting = ref(false);

    if (draftGet('saved') === 'true') {
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
            label: i18n.t('common.gender_male'),
            value: 'M'
        },
        {
            label: i18n.t('common.gender_female'),
            value: 'F'
        },
        {
            label: i18n.t('common.gender_other'),
            value: 'O'
        },
        {
            label: i18n.t('common.gender_no_disclosure'),
            value: 'U'
        }
    ]

    function check__username() {
        if (!RegexUtil.username.test(username.value)) {
            ui__usernameError.value = '用户名只能包含数字、字母、下划线、连字符；不少于三位'
            return false;
        }

        ui__usernameError.value = '';
        return true;
    }

    function check__password() {
        if (!RegexUtil.password.test(password.value)) {
            ui__passwordError.value = '密码至少包含一个字母和一个数字；不少于八位';
            return false;
        }

        ui__passwordError.value = '';
        return true;
    }

    function check__passwordConfirm() {
        if (passwordConfirm.value !== password.value) {
            ui__passwordConfirmError.value = '两次输入不匹配';
            return false;
        }

        if (passwordConfirm.value.trim() === '') {
            ui__passwordConfirmError.value = '不合格的密码';
            return false;
        }

        ui__passwordConfirmError.value = '';
        return true;
    }

    function check__age() {
        const parsed = Number(age.value);
        if (isNaN(parsed) || parsed < 0 || parsed > 120 || age.value.includes('-') || age.value.trim().length === 0) {
            ui__ageError.value = '不正确的年龄';
            return false;
        }
        ui__ageError.value = '';
        return true;
    }

    function check() {
        return [check__username(), check__password(), check__passwordConfirm(), check__age()].every(x => x);
    }

    async function submit() {
        if (!check()) return;

        ui__criticalFeedback.value?.clear();
        ui__warningFeedback.value?.clear();

        ui__submitting.value = true;

        const res = await createUser({
            username: username.value,
            password: password.value,
            age: Number(age.value),
            gender: gender.value as Model.Gender,
            region: region.value as Model.Region
        });

        ui__submitting.value = false;

        if (!res.ok) {
            if (res.data === RequestErrors.ERR_INVALID_BODY) {
                ui__criticalFeedback.value?.raise(i18n.t('failure.register.invalid_body'));
                return;
            }
            if (res.data === RequestErrors.ERR_DUPLICATE_KEY) {
                ui__warningFeedback.value?.raise(i18n.t('failure.register.duplicate_key'));
                return;
            }
            ui__criticalFeedback.value?.raise(i18n.t('failure.register.other', { msg: res.data }));
            return;
        }

        alert('注册成功')
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

    const ui__warningFeedback = useTemplateRef('warningFeedback');
    const ui__criticalFeedback = useTemplateRef('criticalFeedback');

    watch(username, v => check__username());
    watch(password, v => check__password());
    watch(age, v => check__age());
    watch(passwordConfirm, v => check__passwordConfirm());
</script>

<template>
    <Page :title="$t('ui.register.title')" :back-action="{ onAction: () => router.go(-1) }"
        :primary-action="{ content: $t('common.submit'), onAction: submit, loading: ui__submitting }" :secondary-actions="[{
            content: $t('common.save_draft'),
            onAction: saveDraft
        }, {
            content: $t('common.clear_draft'),
            onAction: clearDraft
        }]">
        <Layout>
            <LayoutSection v-if="externalUserRegistrationOnlyNoticeEnabled === 'true'">
                <Banner tone="info" :title="$t('ui.register.extuser_only_title')" @dismiss="() => {
                    externalUserRegistrationOnlyNoticeEnabled = 'false'
                }">
                    <p>{{ $t('ui.register.extuser_only_content') }}</p>
                </Banner>
            </LayoutSection>
            <PopBanner tone="warning" :title="$t('ui.register.problem')" ref="warningFeedback" use-layout-section />
            <PopBanner tone="critical" :title="$t('ui.register.error_occurred')" ref="criticalFeedback"
                use-layout-section />
            <LayoutAnnotatedSection :title="$t('ui.register.annotation_title')"
                :description="$t('ui.register.annotation_desc')">
                <Card>
                    <Box padding-block-end="200">
                        <Form no-validate>
                            <FormLayout>
                                <TextField :error="ui__usernameError" v-model="username" :label="$t('common.username')"
                                    :help-text="$t('ui.register.help_username')" :max-length="20" show-character-count
                                    auto-complete="off" required-indicator />
                                <TextField type="password" :error="ui__passwordError" v-model="password"
                                    :label="$t('common.password')" :help-text="$t('ui.register.help_password')"
                                    auto-complete="off" required-indicator show-character-count />
                                <TextField type="password" :error="ui__passwordConfirmError" v-model="passwordConfirm"
                                    :label="$t('common.confirm_password')"
                                    :help-text="$t('ui.register.help_confirm_password')" auto-complete="off"
                                    required-indicator />

                                <InlineGrid columns="1fr 1fr" gap="400">
                                    <Select :label="$t('common.gender')" :options="genderOptions" v-model="gender" />
                                    <TextField :error="ui__ageError" v-model="age" label="年龄" type="number" steps="1"
                                        min="0" max="120" auto-complete="off" />
                                </InlineGrid>
                                <Select :label="$t('common.country_region')" :options="countryOptions"
                                    v-model="region" />
                            </FormLayout>
                        </Form>
                    </Box>
                </Card>
            </LayoutAnnotatedSection>
        </Layout>
    </Page>
</template>