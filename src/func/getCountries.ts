import Countries from 'i18n-iso-countries';
import Zh from 'i18n-iso-countries/langs/zh.json'
import En from 'i18n-iso-countries/langs/en.json'

export default function getCountries(locale = 'zh') {
    Countries.registerLocale(Zh);
    Countries.registerLocale(En);

    const names = Countries.getNames(locale, {select: 'official'});
    return Object.keys(names).map(x => {
        return {
            label: names[x],
            value: Countries.getName(x, 'en', {select: 'official'}) || ''
        }
    })
}