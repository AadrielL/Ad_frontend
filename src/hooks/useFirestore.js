// src/hooks/useFirestore.js
import { useState, useEffect, useCallback } from 'react';
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    deleteDoc,
    doc,
    Timestamp
} from 'firebase/firestore';
import { useFirebase } from '../context/FirebaseContext';

export const useFirestore = (collectionName = 'orcamentos') => { // export const
    const { db, isAuthReady, getPrivateCollectionPath } = useFirebase();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!isAuthReady || !db) return;

        const collectionPath = getPrivateCollectionPath(collectionName);
        if (!collectionPath) {
            setIsLoading(false);
            return;
        }

        const q = query(collection(db, collectionPath));

        setIsLoading(true);
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const results = [];
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() });
            });
            results.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

            setData(results);
            setIsLoading(false);
            setError(null);
        }, (err) => {
            console.error("Erro ao buscar dados do Firestore:", err);
            setError("Falha ao carregar a lista de orçamentos.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [isAuthReady, db, getPrivateCollectionPath, collectionName]);

    const addDocument = useCallback(async (document) => {
        try {
            const collectionPath = getPrivateCollectionPath(collectionName);
            if (!collectionPath) throw new Error("Caminho da coleção indisponível.");

            const docRef = await addDoc(collection(db, collectionPath), {
                ...document,
                createdAt: Timestamp.now(),
            });
            return docRef.id;
        } catch (err) {
            console.error("Erro ao adicionar documento:", err);
            setError("Não foi possível salvar o orçamento.");
            throw err;
        }
    }, [db, collectionName, getPrivateCollectionPath]);

    const deleteDocument = useCallback(async (id) => {
        try {
            const collectionPath = getPrivateCollectionPath(collectionName);
            if (!collectionPath) throw new Error("Caminho da coleção indisponível.");

            const docRef = doc(db, collectionPath, id);
            await deleteDoc(docRef);
        } catch (err) {
            console.error("Erro ao deletar documento:", err);
            setError("Não foi possível deletar o orçamento.");
            throw err;
        }
    }, [db, collectionName, getPrivateCollectionPath]);

    return { data, isLoading, error, addDocument, deleteDocument };
};