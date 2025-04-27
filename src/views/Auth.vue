<script setup lang="ts">
    import { BlockStack, Box, Button, ButtonGroup, Form, FormLayout, InlineStack, LayoutSection, Text, TextField } from '@ownego/polaris-vue';
    import { ref, useTemplateRef, watch } from 'vue';
    import Logo from '@/components/Logo.vue';
    import router from '@/router';
    import checkUser from '@/func/requests/check-user';
    import { RequestErrors } from '@/func/requests/consts';
    import PopBanner from '@/components/PopBanner.vue';
    import useLang from '@/func/useLang';

    const { t, d, n } = useLang();

    const username = ref('');
    const password = ref('');

    const ui__usernameError = ref('');
    const ui__passwordError = ref('');

    const ui__loginBtnLoading = ref(false);

    const ui__loginFeedback = useTemplateRef('loginFeedback');

    function checkfield__username() {
        if (username.value.trim().length === 0) {
            ui__usernameError.value = t('ui.login.error_username');
            return false;
        }

        ui__usernameError.value = '';
        return true;
    }

    function checkfield__password() {
        if (password.value.trim().length === 0) {
            ui__passwordError.value = t('ui.login.error_password');
            return false;
        }

        ui__passwordError.value = '';
        return true;
    }

    function check() {
        return ![checkfield__username(), checkfield__password()].includes(false);
    }

    async function submit() {
        if (!check()) return;

        ui__loginFeedback.value?.clear();

        ui__loginBtnLoading.value = true;

        const res = await checkUser({
            username: username.value,
            password: password.value
        });

        ui__loginBtnLoading.value = false;

        if (!res.ok) {
            if (res.data === RequestErrors.ERR_INVALID_BODY) ui__loginFeedback.value?.raise(t('failure.auth.invalid_body'));
            if (res.data === RequestErrors.ERR_NOT_FOUND) ui__loginFeedback.value?.raise(t('failure.auth.not_found'));
            if (res.data === RequestErrors.ERR_INCORRECT_INFO) ui__loginFeedback.value?.raise(t('failure.auth.incorrect_info'));
            return;
        }

        alert('登录成功');
    }

    watch(username, v => checkfield__username());
    watch(password, v => checkfield__password());
</script>

<template>
    <Page>
        <Layout>
            <LayoutSection>
                <BlockStack align="center" inline-align="center" style="height: 100dvh;">
                    <LegacyCard rounded-above="xs" class="constraint__authLoginCard">
                        <Box padding="400">
                            <BlockStack inline-align="center">
                                <Text variant="heading2xl" as="h2">
                                    <Logo />
                                </Text>
                                <Text variant="bodyMd" as="p">
                                    {{ t('ui.login.login_into_dashboard') }}
                                </Text>
                            </BlockStack>
                            <Box padding-block-start="200">
                                <PopBanner tone="warning" ref="loginFeedback" />
                            </Box>
                            <Box padding-block-start="200">
                                <Form no-validate @submit="submit">
                                    <FormLayout>
                                        <TextField :error="ui__usernameError" required-indicator size="slim" :label="t('common.username')"
                                            auto-complete="off" v-model="username" />
                                        <TextField :error="ui__passwordError" required-indicator size="slim" :label="t('common.password')"
                                            type="password" auto-complete="off" v-model="password" />
                                    </FormLayout>
                                </Form>
                            </Box>
                            <Box padding-block-start="400">
                                <InlineStack align="end">
                                    <ButtonGroup>
                                        <Button :loading="ui__loginBtnLoading" @click="submit" variant="primary">
                                            {{ t('common.login') }}
                                        </Button>
                                        <Button @click="router.push({ name: 'register' })">
                                            {{ t('common.register') }}
                                        </Button>
                                    </ButtonGroup>
                                </InlineStack>
                            </Box>
                        </Box>
                    </LegacyCard>
                </BlockStack>
            </LayoutSection>
        </Layout>
    </Page>
</template>

<style lang="scss">
.constraint__authLoginCard {
    @media (min-width: 30.625em) {
        width: 300px;
    }

    @media (max-width: 30.6225em) {
        width: 80%;
    }
}
</style>