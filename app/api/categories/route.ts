import { query, collection, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase-config';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
    const fetchCategories = async () => {
        const categoriesQuery = query(collection(db, "categories"), where('status', '==', true), orderBy('sortedAt', 'desc'));
        const querySnapshot = await getDocs(categoriesQuery);
        let categories = [];

        for (const doc of querySnapshot.docs) {
            const value = doc.data();
            let subcategories = null;

            if (value?.isSubcategories) {
                subcategories = await fetchSubCategories(doc.id);
            }

            categories.push({
                category: { ...value, id: doc.id },
                subcategories: subcategories
            });
        }

        return categories;
    }

    const fetchSubCategories = async (catId) => {
        const subcategoriesQuery = query(collection(db, `categories/${catId}/subcategories`), where('status', '==', true));
        const res = await getDocs(subcategoriesQuery);

        if (res.docs) {
            const subcategories = [];

            for (const sub of res.docs) {
                const subCat = sub.data();
                let subSubCategories = null;

                if (subCat?.isSubcategories) {
                    subSubCategories = await fetchSubSubCategories(catId, sub.id);
                }

                subcategories.push({ ...subCat, id: sub.id, subSubCategories });
            }

            return subcategories;
        }

        return null;
    }

    const fetchSubSubCategories = async (catId, subCatId) => {
        const subSubcategoriesQuery = query(collection(db, `categories/${catId}/subcategories/${subCatId}/subcategories`), where('status', '==', true));
        const res = await getDocs(subSubcategoriesQuery);

        if (res.docs) {
            const subSubcategories = [];

            for (const sub of res.docs) {
                subSubcategories.push({ ...sub?.data(), id: sub?.id });
            }

            return subSubcategories;
        }

        return null;
    }

    try {
        const response = await fetchCategories();
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error while fetching categories:", error);
        return NextResponse.json(null);
    }
}
