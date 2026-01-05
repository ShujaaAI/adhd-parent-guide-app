import React, { useState, useEffect } from 'react';
import { Article } from '../types';

const dummyArticles: Article[] = [
  {
    id: 1,
    title: 'Understanding Emotional Dysregulation in ADHD',
    category: 'Behavior',
    createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
    content: '<h2>Why Big Emotions Happen</h2><p>Children with ADHD often experience emotions more intensely than their peers. This is known as emotional dysregulation. It\'s not a choice or bad behavior; their brains are wired differently, making it harder to manage feelings like frustration, excitement, or disappointment.</p><h3>Strategies to Help:</h3><ul><li><strong>Name the Feeling:</strong> Help your child put a name to their emotion. "It looks like you are feeling really frustrated right now."</li><li><strong>Create a Calm-Down Corner:</strong> A quiet space with pillows, a blanket, or a favorite stuffed animal can be a safe place to go when emotions get too big.</li><li><strong>Practice Co-regulation:</strong> Stay calm yourself. Your calm presence can help your child\'s nervous system settle down.</li></ul>',
    isFavorite: false,
  },
  {
    id: 2,
    title: 'The Power of Routine for the ADHD Brain',
    category: 'Strategies',
    createdAt: new Date('2023-10-24T14:30:00Z').toISOString(),
    content: '<h2>Structure Creates Freedom</h2><p>The ADHD brain struggles with executive functions like planning and time management. A predictable daily routine doesn\'t limit your child; it frees up their mental energy because they know what to expect next.</p><h3>Building a Routine:</h3><ol><li><strong>Be Visual:</strong> Use a chart with pictures or simple words for morning, after-school, and bedtime routines.</li><li><strong>Be Consistent:</strong> Try to keep wake-up times, meal times, and bedtimes as consistent as possible, even on weekends.</li><li><strong>Involve Your Child:</strong> Let them help decide the order of tasks. This ownership increases their buy-in.</li></ol>',
    isFavorite: false,
  }
];

const StarIcon: React.FC<{isFavorite: boolean, className?: string}> = ({ isFavorite, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${className} ${isFavorite ? 'text-amber-400' : 'text-slate-400'}`}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
);


const BlogScreen: React.FC = () => {
    const [view, setView] = useState<'list' | 'article' | 'admin'>('list');
    const [activeTab, setActiveTab] = useState<'all' | 'favorites'>('all');
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newContent, setNewContent] = useState('');

    useEffect(() => {
        const storedArticles = localStorage.getItem('adhdParentPal-articles');
        if (storedArticles) {
            setArticles(JSON.parse(storedArticles));
        } else {
            localStorage.setItem('adhdParentPal-articles', JSON.stringify(dummyArticles));
            setArticles(dummyArticles);
        }
    }, []);

    const toggleFavorite = (articleId: number) => {
        const updatedArticles = articles.map(article =>
            article.id === articleId ? { ...article, isFavorite: !article.isFavorite } : article
        );
        setArticles(updatedArticles);
        localStorage.setItem('adhdParentPal-articles', JSON.stringify(updatedArticles));

        // If the currently viewed article is the one being favorited, update its state too
        if (selectedArticle && selectedArticle.id === articleId) {
            setSelectedArticle(prev => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
        }
    };

    const handleSelectArticle = (article: Article) => {
        setSelectedArticle(article);
        setView('article');
    };

    const handlePublish = () => {
        if (!newTitle.trim() || !newCategory.trim() || !newContent.trim()) {
            alert('Please fill out all fields.');
            return;
        }
        const newArticle: Article = {
            id: Date.now(),
            title: newTitle,
            category: newCategory,
            content: newContent,
            createdAt: new Date().toISOString(),
            isFavorite: false,
        };
        const updatedArticles = [newArticle, ...articles];
        setArticles(updatedArticles);
        localStorage.setItem('adhdParentPal-articles', JSON.stringify(updatedArticles));

        setNewTitle('');
        setNewCategory('');
        setNewContent('');
        setView('list');
    };
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    const favoriteArticles = articles.filter(a => a.isFavorite);
    const articlesToShow = activeTab === 'all' ? articles : favoriteArticles;

    if (view === 'admin') {
        return (
            <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-slate-800">Create New Post</h2>
                    <button onClick={() => setView('list')} className="text-sm font-semibold text-teal-600">Cancel</button>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
                    <input type="text" placeholder="Article Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full p-2 border rounded-lg"/>
                    <input type="text" placeholder="Category (e.g., Behavior)" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full p-2 border rounded-lg"/>
                    <textarea placeholder="Start writing your article here. You can use basic HTML tags like <h2>, <h3>, <p>, <ul>, <ol>, and <li>." value={newContent} onChange={(e) => setNewContent(e.target.value)} className="w-full p-2 border rounded-lg h-60 font-mono text-sm" />
                    <button onClick={handlePublish} className="w-full px-4 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700">Publish Article</button>
                </div>
            </div>
        );
    }

    if (view === 'article' && selectedArticle) {
        return (
            <div className="p-4">
                 <button onClick={() => setView('list')} className="text-sm font-semibold text-teal-600 mb-4">← Back to All Articles</button>
                <div className="bg-white p-5 rounded-xl shadow-sm">
                    <div className="flex justify-between items-start">
                         <h1 className="text-2xl font-bold text-slate-800 pr-4">{selectedArticle.title}</h1>
                         <button onClick={() => toggleFavorite(selectedArticle.id)} className="p-2 -mr-2 mt-1">
                             <StarIcon isFavorite={!!selectedArticle.isFavorite} className="w-6 h-6"/>
                         </button>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{formatDate(selectedArticle.createdAt)} · {selectedArticle.category}</p>
                    <div className="prose prose-slate max-w-none mt-4" dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Parenting Blog</h2>
                <button onClick={() => setView('admin')} className="text-sm font-semibold bg-teal-600 text-white px-3 py-1 rounded-full">New Post</button>
            </div>

            <div className="flex justify-center bg-slate-200 rounded-full p-1">
                <button onClick={() => setActiveTab('all')} className={`w-full py-2 text-sm font-semibold rounded-full ${activeTab === 'all' ? 'bg-white text-teal-600 shadow' : 'text-slate-600'}`}>All Articles</button>
                <button onClick={() => setActiveTab('favorites')} className={`w-full py-2 text-sm font-semibold rounded-full ${activeTab === 'favorites' ? 'bg-white text-teal-600 shadow' : 'text-slate-600'}`}>Favorites ({favoriteArticles.length})</button>
            </div>

            {articlesToShow.length > 0 ? articlesToShow.map(article => (
                <div key={article.id} onClick={() => handleSelectArticle(article)} className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow flex items-start gap-4">
                    <div className="flex-grow">
                        <p className="text-xs font-semibold text-teal-700">{article.category.toUpperCase()}</p>
                        <h3 className="font-bold text-slate-800 text-lg mt-1">{article.title}</h3>
                        <p className="text-sm text-slate-500 mt-2">{formatDate(article.createdAt)}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(article.id); }} className="p-2">
                        <StarIcon isFavorite={!!article.isFavorite} className="w-6 h-6" />
                    </button>
                </div>
            )) : (
                 <div className="text-center text-slate-500 bg-slate-100 p-6 rounded-lg">
                    <p>{activeTab === 'favorites' ? "You haven't saved any favorite articles yet." : "No articles available."}</p>
                </div>
            )}
        </div>
    );
};

export default BlogScreen;