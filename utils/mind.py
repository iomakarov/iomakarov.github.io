import os
import pandas as pd
from nltk.stem import SnowballStemmer #

s = ''
word = ''
minLenWord = 0
dictionary = []
dictionaryOut = ['не']
countlib = []
index = 0
stemmer = SnowballStemmer("russian")
charsout = '.,!?:;[]()-"«»/=1234567890'

indir = os.path.dirname(os.path.abspath(__file__))
for root, dirs, filenames in os.walk(indir+'/../goal'):
    for f in filenames:
        ff = open(os.path.join(root, f), 'r')
        s += ff.read()

s = s.lower()
for char in charsout:
    s = s.replace(char, '')

lst = s.split()


for w in lst:
    word = stemmer.stem(w)
    if not(word in dictionaryOut) and len(word)>=minLenWord:
        if word in dictionary: 
            index = dictionary.index(word)
            countlib[index] += 1    
        else:
            dictionary.append(word)
            countlib.append(1)


df = pd.DataFrame({
    'word': dictionary,
    'count': countlib
})
rf = df.sort_values(by=['count'], ascending=False)
print(rf)
rf.to_csv(indir + '/count.csv')

fout = open(indir + '/count.txt', 'w')
fout.write('Всего слов: ' + str(len(lst)) + '\n')
fout.write('Разных слов: ' + str(len(dictionary)) + '\n')

for index, count in enumerate(countlib):
    if count > 10:
        word = dictionary[index]
        fout.write(word + ' ' + str(count) + '\n')
        #print(word,' ',count)
fout.close()